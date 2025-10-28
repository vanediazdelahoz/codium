import { Injectable } from "@nestjs/common";
import { JwtService as NestJwtService } from "@nestjs/jwt"; 
import { ConfigService } from "@nestjs/config";

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  sign(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  verify(token: string): JwtPayload {
    return this.jwtService.verify(token);
  }

  decode(token: string): JwtPayload | null {
    return this.jwtService.decode(token) as JwtPayload | null;
  }
}