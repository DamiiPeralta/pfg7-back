import { IsString, IsOptional, Length, IsNotEmpty } from 'class-validator';

export class CreateTeamDto {
  /**
   * The team name must be a non-empty string of maximum 50 characters.
   * @example "Team Example"
   */
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  team_name: string;

  /**
   * The description must be a string and can be optional.
   * @example "This is an example team."
   */
  @IsOptional()
  @IsString()
  description: string;

  /**
   * The created date must be a string of maximum 50 characters.
   * @example "2022-01-01 12:00:00"
   */
  @IsString()
  @Length(1, 50)
  created_date: string;

  /**
   * The finish date must be a string of maximum 50 characters and can be optional.
   * @example "2022-01-01 12:00:00"
   */
  @IsOptional()
  @IsString()
  @Length(1, 50)
  finish_date?: string;
}

export class UpdateTeamDto {
  /**
   * The team name must be a non-empty string of maximum 50 characters.
   * @example "Team Example"
   */
  @IsString()
  @IsOptional()
  @Length(1, 50)
  team_name: string;

  /**
   * The description must be a string and can be optional.
   * @example "This is an example team."
   */
  @IsOptional()
  @IsString()
  description: string;

  /**
   * The created date must be a string of maximum 50 characters.
   * @example "2022-01-01 12:00:00"
   */
  @IsString()
  @Length(1, 50)
  @IsOptional()
  created_date: string;

  /**
   * The finish date must be a string of maximum 50 characters and can be optional.
   * @example "2022-01-01 12:00:00"
   */
  @IsOptional()
  @IsString()
  @Length(1, 50)
  finish_date?: string;
}