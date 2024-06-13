import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { Template } from "../enums/template.enum";

export class SendEmailDto {
    /**
     * Email sender
     * @example "maddison53@ethereal.email"
     */
    @IsString()
    @IsNotEmpty()
    from: string;

    /**
     * Email subject
     * @example "Email de prueba"
     */
    @IsString()
    @IsNotEmpty()
    subjectEmail: string;
    
    /**
     * Email receiver
     * @example "bar@example.com"
     */
    @IsString()
    @IsNotEmpty()
    sendTo: string;

    /**
     * Email template
     * @example "welcome"
     */
    @IsEnum(Template)
    @IsNotEmpty()
    template: string;

    @IsObject()
    @IsOptional()
    params: any;
}