import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RobotModule } from './robot/robot.module';
import { Robot } from './robot/robot.entity';
import { Position } from './robot/position.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'robot.db',
      entities: [Robot, Position],
      synchronize: true,
    }),
    RobotModule,
  ],
})
export class AppModule {}
