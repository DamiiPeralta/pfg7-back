<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Easy Task

Final project of Henry's bootcamp

[Frontend Repo](https://github.com/DamiiPeralta/PFG7-Front)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
  - [Running the Server](#running-the-server)
  - [API Documentation](#api-documentation)
- [Team](#team)
- [License](#license)

## Introduction

Our project focuses on the development of a task management and estimation platform, aimed at the technology sector and software development teams. In a context where tools like Jira and Trello dominate the market, we aim to offer a more integrated and collaborative solution. This application will not only allow task creation and tracking but will also incorporate voting functionalities to facilitate team decision-making on task estimation. The need we are addressing is to improve efficiency and collaboration in remote or hybrid teams, providing an all-in-one tool that centralizes task management and communication. Our app stands out for integrating well-being and mental health features, such as well-being surveys and overload alerts, to foster a healthy work environment. Additionally, it includes a rewards and achievements system that motivates teams by recognizing and rewarding goal achievement and effective collaboration, creating a more motivating and balanced user experience.

## Features

- **User Authentication:** JWT-based authentication.
- **Task Management:** CRUD operations for tasks.
- **User Management:** CRUD operations for users.
- **Role-based Authorization:** Different access levels for different user roles.
- **File Storage:** Integration with Cloudinary for storing files.
- **API Documentation:** Interactive API documentation with Swagger.

## Technologies Used

- **NestJS:** A progressive Node.js framework for building efficient and scalable server-side applications.
- **TypeScript:** Strongly typed programming language that builds on JavaScript.
- **TypeORM:** ORM for TypeScript and JavaScript (ES7, ES6, ES5).
- **JWT:** For secure authentication.
- **Bcrypt:** For hashing passwords.
- **Swagger:** For API documentation.
- **PostgreSQL:** For the database.
- **Cloudinary:** For file storage.
- **Docker:** For containerization.
- **Render:** For deployment.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/DamiiPeralta/PFG7-Back
   cd PFG7-Back
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up the environment variables:**
   Create a `.env` file in the root of the project and add the following variables:

   ```env
   DATABASE_HOST=your_database_host
   DATABASE_PORT=your_database_port
   DATABASE_USERNAME=your_database_username
   DATABASE_PASSWORD=your_database_password
   DATABASE_NAME=your_database_name
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

## Usage

### Running the Server

To start the server, run:

```bash
npm run start:dev
```

The server will be running on `http://localhost:3000`.

### API Documentation

Access the Swagger documentation at `http://localhost:3000/api`.

## Team

The following individuals have contributed to the development of this project:

### Frontend

| [<img src="https://avatars.githubusercontent.com/u/137831158?v=4" width=80><br><sub>Delfina Merlo</sub>](https://github.com/D-MERLO) | [<img src="https://avatars.githubusercontent.com/u/117830607?v=4" width=80><br><sub>Samanta Driuzzi</sub>](https://github.com/SamantaDriuzzi) | [<img src="https://avatars.githubusercontent.com/u/130951872?v=4" width=80><br><sub>Yesenia Gonzalez</sub>](https://github.com/yesiviola) |
| :---: | :---: | :---: |

### Backend

| [<img src="https://avatars.githubusercontent.com/u/86084164?v=4" width=80><br><sub>Damian Peralta</sub>](https://github.com/DamiiPeralta) | [<img src="https://avatars.githubusercontent.com/u/83714656?v=4" width=80><br><sub>Alejandro Campaya</sub>](https://github.com/Alejandro0419) | [<img src="https://avatars.githubusercontent.com/u/97191718?v=4" width=80><br><sub>Cristian Araya</sub>](https://github.com/ArayaCG) |
| :---: | :---: | :---: |

## License

This project is licensed under the [MIT License](LICENSE).
