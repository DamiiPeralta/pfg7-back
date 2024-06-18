// src/dto/credentials.dto.ts
import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CredentialsDto {

  /**
   * The nickname must be a non-empty string of maximum 80 characters.
   * @example "johndoe"
   */
  @IsString()
  @IsOptional()
  nickname: string;

  /**
   * The email must be a non-empty string and must have a valid email format.
   * @example "user@example.com"
   */
  @IsString()
  @IsOptional()
  email: string;

  /**
   * The password must be a non-empty string of minimum 8 characters, maximum 15 characters, and must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.
   * @example "Password123!"
   */
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ChangePasswordDto {
    /**
   * The email must be a non-empty string and must have a valid email format.
   * @example "user@example.com"
   */
    @IsString()
    @IsOptional()
    email: string;
  
    /**
     * The current password must be a non-empty string of minimum 8 characters, maximum 15 characters, and must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.
     * @example "Password123!"
     */
    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])/)
    password: string;
    
    /**
     * The new password must be a non-empty string of minimum 8 characters, maximum 15 characters, and must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.
     * @example "NewPassword%789"
     */
    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])/)
    newPassword: string;

}