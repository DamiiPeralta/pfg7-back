import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "Correo electrónico del usuario",
        example: "usuario@example.com",
    })
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "Contraseña del usuario",
        example: "contraseña123",
    })
    password: string;
}
