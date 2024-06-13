import { Injectable } from '@nestjs/common';
import { SendEmailDto } from '../../dtos/sendEmail.dto';
import { Email } from 'src/email/providers/email/email';

@Injectable()
export class EmailService {

    constructor(
        private emailProvider: Email
    ){}

    async sendEmail(body: SendEmailDto){
        try {
            const { from, subjectEmail, sendTo } = body
            const html = this.getTemplate(body)
            await this.emailProvider.sendEmail(from, subjectEmail, sendTo, html)
            return true
        } catch (error) {
            throw error            
        }
    }

    async healthCheck(){
        try {
            await this.emailProvider.testEmail()
            return {
                statusService: 'UP'
            }
        } catch (error) {
            throw error
        }
    }

    private getTemplate(body){
        const template = this.getTemplateFile(body.template)
        const html = template.fillTemplate(body)
        return html
    }

    private getTemplateFile(template){
        const path = '../../templates'
        const templateFile = require(`${path}/${template}`)
        return templateFile
    }
}