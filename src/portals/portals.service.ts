import { Injectable } from '@nestjs/common';

@Injectable()
export class PortalsService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async getAllWorkspaces(user: any): Promise<any> {
    const url = 'https://api.clickup.com/api/v2/team';
    const headers = {
      Authorization: `Bearer ${user.accessToken}`,
    };

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    return data;
  }
}
