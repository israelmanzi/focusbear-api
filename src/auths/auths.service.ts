import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../users/users.service';
import fetch from 'node-fetch';
import { log } from 'console';

@Injectable()
export class AuthsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  getClickUpLoginUrl() {
    const client_id = this.configService.get('CLICKUP_CLIENT_ID');
    const redirect_uri = this.configService.get('CLIENT_URL');

    return `https://app.clickup.com/api?client_id=${client_id}&redirect_uri=${redirect_uri}`;
  }

  async authorize(query: Record<string, any>) {
    const queryParams = new URLSearchParams({
      client_id: this.configService.get('CLICKUP_CLIENT_ID'),
      client_secret: this.configService.get('CLICKUP_CLIENT_SECRET'),
      code: query.code,
    });

    const url = `https://api.clickup.com/api/v2/oauth/token?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'POST',
    });

    const data = await response.json();

    const resp = await fetch('https://api.clickup.com/api/v2/user', {
      method: 'GET',
      headers: {
        Authorization: data.access_token,
      },
    });

    const { user } = await resp.json();

    log(user.email);

    const existingUser = await this.userService.findByEmail(user.email);

    if (!existingUser) {
      await this.userService.create({
        id: user.id,
        email: user.email,
        accessToken: data.access_token,
      });
    } else {
      await this.userService.update(user.id, {
        accessToken: data.access_token,
      });
    }

    return {
      access_token: data.access_token,
      profile: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
