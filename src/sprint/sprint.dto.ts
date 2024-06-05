import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateSprintDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    name: string;

    @IsString()
    @IsOptional()
    @Length(1, 20)
    goal: string;

    @IsOptional()
    @IsString()
    status: string;
  
}
export class UpdateSprintDto {
    @IsString()
    @IsOptional()
    @Length(1, 50)
    name: string;

    @IsString()
    @IsOptional()
    @Length(1, 20)
    goal: string;

    @IsOptional()
    @IsString()
    status: string;
}