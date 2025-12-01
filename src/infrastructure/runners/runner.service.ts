import { Injectable, Logger } from '@nestjs/common';
import * as Docker from 'dockerode';
import { Language } from '@prisma/client';

export interface RunResult {
  output: string;
  error?: string;
  timeMs: number;
  exitCode: number;
}

@Injectable()
export class RunnerService {
  private readonly logger = new Logger('RunnerService');
  private docker: Docker = new Docker();

  async run(
    language: Language | string,
    code: string,
    input: string,
    limits: { timeout: number; memory: number; cpus: number },
  ): Promise<RunResult> {
    const lang = typeof language === 'string' ? language.toUpperCase() : language;

    switch (lang) {
      case Language.PYTHON:
      case 'PYTHON':
        return this.runPython(code, input, limits);
      case Language.NODEJS:
      case 'NODEJS':
        return this.runNodeJs(code, input, limits);
      case Language.CPP:
      case 'CPP':
        return this.runCpp(code, input, limits);
      case Language.JAVA:
      case 'JAVA':
        return this.runJava(code, input, limits);
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  private async runPython(
    code: string,
    input: string,
    limits: { timeout: number; memory: number; cpus: number },
  ): Promise<RunResult> {
    return this.executeContainer({
      image: 'python:3.11-alpine',
      cmd: ['python', '/tmp/solution.py'],
      code,
      input,
      limits,
      fileName: 'solution.py',
    });
  }

  private async runNodeJs(
    code: string,
    input: string,
    limits: { timeout: number; memory: number; cpus: number },
  ): Promise<RunResult> {
    return this.executeContainer({
      image: 'node:20-alpine',
      cmd: ['node', '/tmp/solution.js'],
      code,
      input,
      limits,
      fileName: 'solution.js',
    });
  }

  private async runCpp(
    code: string,
    input: string,
    limits: { timeout: number; memory: number; cpus: number },
  ): Promise<RunResult> {
    // Compilar primero
    const compileResult = await this.executeContainer({
      image: 'gcc:latest',
      cmd: ['g++', '/tmp/solution.cpp', '-o', '/tmp/solution'],
      code,
      input: '',
      limits,
      fileName: 'solution.cpp',
    });

    if (compileResult.exitCode !== 0) {
      return {
        ...compileResult,
        error: `COMPILATION_ERROR: ${compileResult.error || compileResult.output}`,
      };
    }

    // Ejecutar
    return this.executeContainer({
      image: 'gcc:latest',
      cmd: ['/tmp/solution'],
      code: '', // Ya compilado
      input,
      limits,
      fileName: '',
      skipWrite: true,
    });
  }

  private async runJava(
    code: string,
    input: string,
    limits: { timeout: number; memory: number; cpus: number },
  ): Promise<RunResult> {
    // Java necesita nombre de clase = Solution
    const finalCode = code.includes('public class Solution')
      ? code
      : code.replace(/public class \w+/, 'public class Solution');

    return this.executeContainer({
      image: 'openjdk:21-slim',
      cmd: ['java', '-cp', '/tmp', 'Solution'],
      code: finalCode,
      input,
      limits,
      fileName: 'Solution.java',
    });
  }

  private async executeContainer(params: {
    image: string;
    cmd: string[];
    code: string;
    input: string;
    limits: { timeout: number; memory: number; cpus: number };
    fileName: string;
    skipWrite?: boolean;
  }): Promise<RunResult> {
    const startTime = Date.now();
    let container;

    try {
      // 1. Crear contenedor con límites de seguridad
      container = await this.docker.createContainer({
        Image: params.image,
        Cmd: params.cmd,
        OpenStdin: true,
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        StdinOnce: false,
        HostConfig: {
          NetworkMode: 'none', // SIN INTERNET ✅
          Memory: params.limits.memory * 1024 * 1024, // bytes
          MemorySwap: params.limits.memory * 1024 * 1024, // no swap
          CpuQuota: Math.floor(params.limits.cpus * 100000), // CPU shares
          PidsLimit: 10, // máximo 10 procesos
          ReadonlyRootfs: false,
          CapDrop: ['ALL'], // Dropear todas las capabilities
          SecurityOpt: ['no-new-privileges:true'],
        },
      });

      // 2. Escribir código (si lo hay)
      if (params.code && !params.skipWrite) {
        try {
          const tarStream = this.createTarBuffer(params.fileName, params.code);
          await container.putArchive(tarStream, { path: '/tmp' });
        } catch (e) {
          this.logger.warn(`Could not write file: ${e.message}`);
        }
      }

      // 3. Iniciar contenedor
      await container.start();

      // 4. Enviar entrada y capturar salida
      const stream = await container.attach({
        stream: true,
        stdin: true,
        stdout: true,
        stderr: true,
      });

      const stdoutChunks: Buffer[] = [];
      const stderrChunks: Buffer[] = [];

      // Separar stdout y stderr (Docker demux format)
      stream.on('data', (chunk: Buffer) => {
        // Docker attach format: [8 byte header][data]
        // header[0] = stream type (1=stdout, 2=stderr)
        if (chunk.length > 8) {
          const streamType = chunk[0];
          const data = chunk.slice(8);
          if (streamType === 1) {
            stdoutChunks.push(data);
          } else if (streamType === 2) {
            stderrChunks.push(data);
          }
        }
      });

      // Enviar entrada
      stream.write(params.input);
      stream.end();

      // Esperar con timeout
      const output = await Promise.race([
        new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
          stream.on('end', () => {
            resolve({
              stdout: Buffer.concat(stdoutChunks).toString(),
              stderr: Buffer.concat(stderrChunks).toString(),
            });
          });
          stream.on('error', reject);
        }),
        new Promise<{ stdout: string; stderr: string }>((_, reject) =>
          setTimeout(
            () => reject(new Error('TIMEOUT')),
            params.limits.timeout,
          ),
        ),
      ]);

      const timeMs = Date.now() - startTime;

      // Obtener exit code
      const exitData = await container.wait();
      const exitCode = exitData.StatusCode || 0;

      return {
        output: output.stdout,
        error: output.stderr || undefined,
        timeMs,
        exitCode,
      };
    } catch (error) {
      const timeMs = Date.now() - startTime;

      if (error.message === 'TIMEOUT') {
        return {
          output: '',
          error: 'TIME_LIMIT_EXCEEDED',
          timeMs,
          exitCode: -1,
        };
      }

      return {
        output: '',
        error: `RUNTIME_ERROR: ${error.message}`,
        timeMs,
        exitCode: 1,
      };
    } finally {
      // Limpiar: eliminar contenedor
      if (container) {
        try {
          await container.remove({ force: true });
        } catch (e) {
          this.logger.warn(`Failed to remove container: ${e.message}`);
        }
      }
    }
  }

  private createTarBuffer(fileName: string, content: string): Buffer {
    // Crear un tar simple con el archivo
    // Para simplificar, usar Buffer directo (en producción usar 'tar' module)
    const fileContent = Buffer.from(content);
    const fileNameBytes = Buffer.from(fileName);

    // Header TAR (512 bytes)
    const header = Buffer.alloc(512);
    fileNameBytes.copy(header, 0);
    header.write('0000644\0', 100); // permisos
    header.write('0000000\0', 108); // uid
    header.write('0000000\0', 116); // gid
    header.write(
      '00000000000' + fileContent.length.toString(8).padStart(12, '0'),
      124,
    ); // tamaño
    header.write(Math.floor(Date.now() / 1000).toString(8).padStart(12, '0'), 136); // mtime

    // Checksum
    let checksum = 0;
    for (let i = 0; i < 512; i++) {
      if (i >= 148 && i < 156) {
        checksum += 32; // space para checksum
      } else {
        checksum += header[i];
      }
    }
    header.write(checksum.toString(8).padStart(8, '0') + '\0', 148);

    // Padding del archivo
    const padding = Buffer.alloc((512 - (fileContent.length % 512)) % 512);

    // End of archive (2 bloques de 512 bytes vacíos)
    const endOfArchive = Buffer.alloc(1024);

    return Buffer.concat([header, fileContent, padding, endOfArchive]);
  }
}
