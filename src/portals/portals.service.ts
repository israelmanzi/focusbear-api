import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PortalsService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async getAllWorkspaces(user: any): Promise<any> {
    const url = 'https://api.clickup.com/api/v2/team';
    const headers = {
      Authorization: `Bearer ${user.accessToken}`,
    };

    return axios.get(url, { headers }).then((res) => res.data);
  }
}
