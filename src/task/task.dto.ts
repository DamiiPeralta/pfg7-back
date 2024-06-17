import {
  IsString,
  IsOptional,
  Length,
  IsInt,
  IsNotEmpty,
} from 'class-validator';
import { statusTask } from '../enum/task.enum';
import { User } from 'src/user/user.entity';

export class CreateTaskDto {
  /**
   * The name must be a non-empty string of maximum 50 characters.
   * @example "Example Task"
   */
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name: string;

  /**
   * The description must be a string and can be optional.
   * @example "This is an example task."
   */
  @IsOptional()
  @IsString()
  description: string;

  /**
   * The status must be a string and can be optional.
   * @example "inProgress"
   */
  @IsOptional()
  @IsString()
  status: statusTask;

  /**
   * The priority must be an integer and can be optional.
   * @example 1
   */
  @IsOptional()
  @IsInt()
  priority: number;

  /**
   * The story points must be an integer and can be optional.
   * @example 2
   */
  @IsOptional()
  @IsInt()
  story_points: number;

  /**
   * The user owner can be optional.
   * @example id user owner
   */
  @IsOptional()
  user_owner: User;
}

export class UpdateTaskDto {
  /**
   * The name must be a non-empty string of maximum 50 characters.
   * @example "Example Task"
   */
  @IsString()
  @IsOptional()
  @Length(1, 50)
  name: string;

  /**
   * The description must be a string and can be optional.
   * @example "This is an example task."
   */
  @IsOptional()
  @IsString()
  description: string;

  /**
   * The status must be a string and can be optional.
   * @example "In Progress"
   */
  @IsOptional()
  @IsString()
  status: statusTask;

  /**
   * The priority must be an integer and can be optional.
   * @example 1
   */
  @IsOptional()
  @IsInt()
  priority: number;

  /**
   * The story points must be an integer and can be optional.
   * @example 2
   */
  @IsOptional()
  @IsInt()
  story_points: number;

  /**
   * The user owner can be optional.
   * @example id user owner
   */
  @IsOptional()
  user_owner: User;
  /**
   * The collaborators can be optional.
   * @example id user collaborator
   */
  @IsOptional()
  collaborator: User;
}
