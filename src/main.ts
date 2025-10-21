import { NestFactory } from "@nestjs/core"
import { ValidationPipe, Logger } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { ConfigService } from "@nestjs/config"
import { AppModule } from "./app.module"

async function bootstrap() {
  const logger = new Logger("Bootstrap")
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService)
  const port = configService.get<number>("PORT", 3000)
  const apiPrefix = configService.get<string>("API_PREFIX", "api")

  // Global prefix
  app.setGlobalPrefix(apiPrefix)

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  // CORS
  app.enableCors()

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("Codium API")
    .setDescription("Plataforma para evaluar algoritmos - Juez Online")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("auth", "Autenticación y autorización")
    .addTag("challenges", "Gestión de retos")
    .addTag("submissions", "Envío y evaluación de soluciones")
    .addTag("courses", "Gestión de cursos")
    .addTag("users", "Gestión de usuarios")
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("docs", app, document)

  await app.listen(port)

  logger.log(`Application is running on: http://localhost:${port}/${apiPrefix}`)
  logger.log(`Swagger documentation: http://localhost:${port}/docs`)
}

bootstrap()
