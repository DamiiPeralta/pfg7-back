import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateSprintDto {
  /**
   The name must be a non-empty string of maximum 50 characters.
   @example "Example sprint"
   */
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name: string;

  /**
   The goal must be an optional string of maximum 20 characters.
   @example "First Goal"
   */
  @IsString()
  @IsOptional()
  @Length(1, 20)
  goal: string;

  /**
   The status must be an optional string.
   @example "In progress"
   */
  @IsOptional()
  @IsString()
  status: string;
}
export class UpdateSprintDto {
  /**
   The name must be a non-empty string of maximum 50 characters.
   @example "Example sprint"
   */
  @IsString()
  @IsOptional()
  @Length(1, 50)
  name: string;

  /**
   The goal must be an optional string of maximum 20 characters.
   @example "Second Goal"
   */
  @IsString()
  @IsOptional()
  @Length(1, 20)
  goal: string;

  /**
   The status must be an optional string.
   @example "In progress"
   */
  @IsOptional()
  @IsString()
  status: string;
}
