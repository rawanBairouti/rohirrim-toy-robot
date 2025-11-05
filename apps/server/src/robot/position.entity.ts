import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import * as robotEntity from 'src/robot/robot.entity';

@Entity()
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => robotEntity.Robot, (robot) => robot.history)
  robot: robotEntity.Robot;

  @Index()
  @Column()
  robotId: number;

  @Column()
  x: number;

  @Column()
  y: number;

  @Column()
  direction: robotEntity.Direction;
}
