import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PortalsService } from './portals.service';
import { JwtAuthGuard } from 'src/auths/guard/jwt.auth.guard';

@Controller('portals')
export class PortalsController {
  constructor(private readonly portalsService: PortalsService) {}

  @Get('workspaces/all')
  @UseGuards(JwtAuthGuard)
  async getAllWorkspaces(@Req() req) {
    return this.portalsService.getAllWorkspaces(req.user);
  }
}
