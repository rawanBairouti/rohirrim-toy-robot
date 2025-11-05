import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';
import { Position } from 'src/robot/position.entity';

export type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

@Entity()
export class Robot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  x: number;

  @Column()
  y: number;

  @Column()
  direction: Direction;

  @OneToMany(() => Position, (history) => history.robot)
  history: Position[];
}
