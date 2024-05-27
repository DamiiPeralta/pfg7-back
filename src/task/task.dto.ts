import { IsString, IsOptional, Length, IsInt, IsNotEmpty } from 'class-validator';

export class TaskDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsInt()
  priority: number;

  @IsOptional()
  @IsInt()
  story_points: number;
}
