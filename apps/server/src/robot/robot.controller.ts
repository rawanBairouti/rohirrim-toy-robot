import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { RobotService } from './robot.service';
import { SyncRobotDto } from './dto/sync-robot.dto';
import { Direction } from './robot.entity';

@Controller('robot')
export class RobotController {
  constructor(private readonly robotService: RobotService) {}

  @Post('create')
  create(@Body() dto: { x: number; y: number; direction: Direction }) {
    return this.robotService.createNew(dto.x, dto.y, dto.direction);
  }

  @Post('sync/:robotId')
  sync(@Param('robotId') robotId: string, @Body() dto: SyncRobotDto) {
    return this.robotService.sync(dto, parseInt(robotId));
  }

  @Get('current/:robotId')
  getCurrent(@Param('robotId') robotId: string) {
    return this.robotService.getCurrent(parseInt(robotId));
  }

  @Get('latest')
  getLatest() {
    return this.robotService.getLatest();
  }

  @Get('latest/history')
  getLatestHistory(@Query('limit') limit?: string) {
    return this.robotService.getLatestHistory(limit ? parseInt(limit) : 100);
  }
}
