import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, IsBoolean, IsOptional, MaxLength, MinLength, Matches } from 'class-validator';

export class UserDto {
  /**
   The name must be a non-empty string of maximum 80 characters.
   @example "John Doe"
   */
  @ApiProperty({
    description: "The name of the user",
    example: "John Doe",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  /**
   * The nickname must be a non-empty string of maximum 80 characters.
   * @example "johndoe"
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  nickname: string;

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

export class UpdateUserDto{
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  /**
   * The nickname must be a non-empty string of maximum 80 characters.
   * @example "johndoe"
   */
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  nickname: string;
  /**
   * The email must be a non-empty string and must have a valid email format.
   * @example "user@example.com"
   */
  @IsOptional()
  @IsEmail()
  email: string;

  /**
   * The password must be a non-empty string of minimum 8 characters, maximum 15 characters, and must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.
   * @example "Password123!"
   */
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
  password: string;
}