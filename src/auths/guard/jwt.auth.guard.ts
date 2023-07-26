import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from 'src/users/users.service';
import fetch from 'node-fetch';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No token provided!');
    }

    const url = 'https://api.clickup.com/api/v2/user';

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      const { user } = await response.json();

      request['user'] = {
        user,
        accessToken: token,
      };
    } catch (e: any) {
      throw new UnauthorizedException('Invalid token!' + e);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
