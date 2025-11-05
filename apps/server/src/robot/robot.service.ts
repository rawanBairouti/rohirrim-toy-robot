import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Direction, Robot } from './robot.entity';
import { Position } from 'src/robot/position.entity';
import { SyncRobotDto } from './dto/sync-robot.dto';

@Injectable()
export class RobotService {
  constructor(
    private readonly ds: DataSource,
    @InjectRepository(Robot)
    private robot: Repository<Robot>,
    @InjectRepository(Position)
    private history: Repository<Position>,
  ) {}

  async createNew(x: number, y: number, direction: Direction) {
    return this.ds.transaction(async (trx) => {
      const robotRepo = trx.getRepository(Robot);
      const historyRepo = trx.getRepository(Position);

      const robot = robotRepo.create({
        x,
        y,
        direction,
      });
      await robotRepo.save(robot);

      await historyRepo.save(
        historyRepo.create({
          robotId: robot.id,
          x,
          y,
          direction,
        }),
      );

      return robot;
    });
  }

  async sync(dto: SyncRobotDto, robotId: number) {
    const x = dto.x;
    const y = dto.y;
    const direction = dto.direction;

    return this.ds.transaction(async (trx) => {
      const robotRepo = trx.getRepository(Robot);
      const historyRepo = trx.getRepository(Position);

      const current = await robotRepo.findOne({ where: { id: robotId } });

      if (!current) {
        throw new Error(`Robot with id ${robotId} not found`);
      }

      current.x = x;
      current.y = y;
      current.direction = direction;
      await robotRepo.save(current);

      const position = historyRepo.create({
        robotId,
        x,
        y,
        direction,
      });
      await historyRepo.save(position);

      return current;
    });
  }

  getCurrent(robotId: number) {
    return this.robot.findOne({ where: { id: robotId } });
  }

  async getLatest() {
    const robots = await this.robot.find({
      order: { id: 'DESC' },
      take: 1,
    });
    return robots[0] || null;
  }

  async getLatestHistory(limit = 50) {
    const latestRobot = await this.getLatest();
    if (!latestRobot) {
      return [];
    }

    return this.history.find({
      where: { robotId: latestRobot.id },
      order: { id: 'DESC' },
      take: limit,
    });
  }
}
