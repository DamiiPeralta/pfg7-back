import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsInt, IsNotEmpty , IsString, Length, Matches } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @ApiProperty({
        description:"El email del usuario, debe tener como minimo 3 caracteres",
        example:"damii@hotmail.com"
    })
    email: string;
    @IsNotEmpty()
    @IsString()
    @Length(3,80)
    @ApiProperty({
        description:"El nombre del usuario, debe tener como minimo 3 caracteres",
        example:"Damian"
    })
    name: string;
    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,15}$/gm, {
        message:
          'Password must be between 8 and 15 characters long with 1 special character and capital character each',
      })
    @ApiProperty({
        description:"La contraseña debe tener una minuscula, una mayuscula, un caracter especial, un numero y tener entre 8 y 16 caracteres",
        example:"P@ssword123"
    })
    password: string;
    @Length(3,80)
    address: string;
    @IsNotEmpty()
    @IsInt()
    phone: number;
    @IsString()
    @Length(3,20)
    country?: string;
    @IsString()
    @Length(3,20)
    city?: string;
    @IsEmpty() 
    @ApiProperty({
        description:"Asignado por default al momento de crear el usuario, no debe ser incluido en el body",
        default: false
    }) 
    isAdmin:boolean;

    constructor(partial: Partial<CreateUserDto>) {
        Object.assign(this, partial);
    }
}
