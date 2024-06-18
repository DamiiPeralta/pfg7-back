import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { FileUploadRepository } from './file_upload.repository';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly fileUploadRepository: FileUploadRepository,
    private readonly userService: UserService,
  ) {}

  async uploadImage(file: Express.Multer.File, id: string) {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const response = await this.fileUploadRepository.uploadImage(file);
    await this.userService.updateUser(id, {
      profilePicture: response.secure_url,
    });

    return await this.userService.getUserById(id);
  }
}
