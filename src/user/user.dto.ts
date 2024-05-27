import { IsNotEmpty, IsEmail, IsString, IsBoolean, IsOptional } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  readonly token: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly nickname: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly created: string;

  @IsNotEmpty()
  @IsString()
  readonly last_login: string;

  @IsOptional()
  @IsBoolean()
  readonly status?: boolean;

  @IsOptional()
  readonly tasks?: any[];

  @IsOptional()
  readonly teams?: any[];
}
