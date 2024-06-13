import { BadGatewayException, Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { EmailService } from './services/email/email.service';
import { SendEmailDto } from './dtos/sendEmail.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Email')
@Controller('api/email')
export class EmailController {

    constructor(
        private emailService: EmailService,
    ){}

    @ApiOperation({
        summary: 'Email function for Health Check',
        description: 'Doesn´t expect any parameters. Returns Up when the service is running correctly, otherwise it returns an error',
    })
    @Get('health')
    async healthCheck(@Res() res: Response){
        try {
            const response = await this.emailService.healthCheck()
            res.status(HttpStatus.OK).send(response)           
        } catch (error) {
            throw new BadGatewayException('Failed to send email health check ' + error)
        }
    }

    @ApiOperation({
        summary: 'Email Test function',
        description: 'Sends an email to the email provided in the body',
    })
    @Post('sendEmail')
    async sendEmail(@Body() body: SendEmailDto, @Res() res: Response){
        try {
            const response = await this.emailService.sendEmail(body)
            res.status(HttpStatus.OK).send(response)
        } catch (error) {
            throw new BadGatewayException('Failed to send email ' + error)
        }
    }
}