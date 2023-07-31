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

  async getWorkspaceTasks({
    user,
    workspaceId,
  }: {
    user: any;
    workspaceId: string;
  }): Promise<any> {
    const query = new URLSearchParams({ archived: 'false' }).toString();

    const folderUrl = `https://api.clickup.com/api/v2/space/${workspaceId}/folder?${query}`;

    const folders = await fetch(folderUrl, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    }).then((res) => res.json());

    return folders;
  }
}
