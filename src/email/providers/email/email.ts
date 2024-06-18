import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'
dotenv.config()

@Injectable()
export class Email {

      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    async sendEmail(from, subjectEmail, sendTo, html){
        try {
            const info = await this.transporter.sendMail({
                from, // sender address
                to: sendTo, // list of receivers
                subject: subjectEmail, // Subject line
                html: html, // html body
              });
            
        } catch (error) {
            throw error            
        }
    }

    async testEmail(){
      try {

          const info = await this.transporter.sendMail({
          from: '"Easy Task Team" <easytasktm@gmail.com>', // sender address
          to: "bar@example.com, baz@example.com", // list of receivers
          subject: 'Email de prueba', // Subject line
          html: '<b>Test Email</b>', // html body
        });
      } catch (error) {
        throw error
      }
    }
}