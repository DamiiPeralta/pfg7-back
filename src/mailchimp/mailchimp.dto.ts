import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class MailchimpDto {
  /**
   * The firstname must be a non-empty string of maximum 80 characters.
   * @example "Jhon"
   */
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  firstName: string;
  /**
   * The lastname must be a non-empty string of maximum 80 characters.
   * @example "Doe"
   */
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  lastName: string;
  /**
   * The email must be a non-empty string and must have a valid email format.
   * @example "user@example.com"
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
