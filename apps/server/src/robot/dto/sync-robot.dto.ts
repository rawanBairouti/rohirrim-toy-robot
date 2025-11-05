/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsInt, Min, Max, IsIn } from 'class-validator';

export class SyncRobotDto {
  @IsInt()
  @Min(0)
  @Max(4)
  x: number;

  @IsInt()
  @Min(0)
  @Max(4)
  y: number;

  @IsIn(['NORTH', 'EAST', 'SOUTH', 'WEST']) direction:
    | 'NORTH'
    | 'EAST'
    | 'SOUTH'
    | 'WEST';
}
