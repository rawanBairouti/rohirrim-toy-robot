import { Module } from '@nestjs/common';
import { RobotService } from './robot.service';
import { RobotController } from './robot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Robot } from './robot.entity';
import { Position } from './position.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Robot, Position])],
  providers: [RobotService],
  controllers: [RobotController],
})
export class RobotModule {}
