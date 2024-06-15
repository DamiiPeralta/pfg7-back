import { Module } from '@nestjs/common';
import { FileUploadController } from './file_upload.controller';
import { FileUploadService } from './file_upload.service';
import { CloudinaryConfig } from 'src/config/cloudinary';
import { FileUploadRepository } from './file_upload.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';
import { User } from 'src/user/user.entity';
import { Credentials } from 'src/credentials/credentials.entity';
import { Team } from 'src/team/team.entity'; // Asegúrate de importar Team si es necesario

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Credentials, Team]), // Incluye Team si es necesario
  ],
  controllers: [FileUploadController],
  providers: [
    FileUploadService,
    CloudinaryConfig,
    FileUploadRepository,
    UserService,
    UserRepository,
  ],
})
export class FileUploadModule {}
