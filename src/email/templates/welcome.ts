import { SendEmailDto } from "../dtos/sendEmail.dto";

export const fillTemplate = (body: SendEmailDto) => {
    const { params } = body
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <h1>Hola ${params.name}!!!</h1>
            <h2>Este es un mensaje de prueba desde el micro servicio de email</h2>
        </body>
        </html> 
    `
}