import { SendEmailDto } from "../dtos/sendEmail.dto";

export const fillTemplate = (body: SendEmailDto) => {
    const { params } = body
    return `
<!DOCTYPE html>
<html>
<head>
	<title>Cuenta creada con éxito</title>
	<style>
		body {
			font-family: Arial, sans-serif;
			background-color: #f9f9f9;
		}
		.container {
			max-width: 600px;
			margin: 40px auto;
			padding: 20px;
			background-color: #fff;
			border: 1px solid #ddd;
			border-radius: 10px;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		}
		.title {
			font-size: 24px;
			color: #333;
			margin-bottom: 10px;
		}
		.text {
			font-size: 16px;
			color: #666;
			margin-bottom: 20px;
		}
		.button {
			background-color: #4CAF50;
			color: #fff;
			padding: 10px 20px;
			border: none;
			border-radius: 5px;
			cursor: pointer;
		}
		.button:hover {
			background-color: #3e8e41;
		}
	</style>
</head>
<body>
	<div class="container">
		<h2 class="title">¡Cuenta creada con éxito!</h2>
		<p class="text">Estimado/a ${params.name},</p>
		<p class="text">Le damos la bienvenida a la plataforma de EasyTask™. Su cuenta ha sido creada con éxito y ya puede acceder con su dirección de correo electrónico y contraseña.</p>
		<p class="text">Para acceder a su cuenta, haga clic en el siguiente enlace:</p>
		<a href="https://easy-task-cyan.vercel.app/login" class="button">Iniciar sesión</a>
		<p class="text">Si tiene alguna pregunta o necesita ayuda, no dude en ponerse en contacto con nosotros.</p>
		<p class="text">Atentamente,</p>
		<p class="text">Equipo de EasyTask™</p>
	</div>
</body>
</html>
    `
}