// src/dto/credentials.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CredentialsDto {
  
  @IsString()
  @IsOptional()
  nickname: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
