import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file_upload.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/roles/roles.enum';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';


@Controller('files')
@ApiTags('Upload Image')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('profilePicture')
  // @Roles(Role.User, Role.Admin)
  // @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Upload profile picture',
    description:
      'Expects the user ID and the image in the form data. Returns the modified User object.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      required: ['image'],
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          default: null,
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image')) // Asegúrate de que el campo coincide con el nombre en la APIBody
  uploadImage(
    @Query('id') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 200000, // 200 KB
            message: 'Exceeds the maximum allowed size of 200KB',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp|svg|gif)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.fileUploadService.uploadImage(file, userId);
  }
}
