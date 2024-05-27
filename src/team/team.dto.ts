import { IsString, IsOptional, IsUUID, Length, IsNotEmpty } from 'class-validator';

export class TeamDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  team_name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsString()
  @Length(1, 50)
  created_date: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  finish_date?: string;

}
