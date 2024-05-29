import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  /**
   * The email must be a non-empty string and must have a valid email format.
   * @example "user@example.com"
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * The password must be a non-empty string of minimum 8 characters, maximum 15 characters, and must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.
   * @example "Password123!"
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
  password: string;
}
