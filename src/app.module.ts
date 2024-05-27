import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from "./config/typeorm"
//import { FileUploadModule } from './file_upload/file_upload.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      load: [typeOrmConfig]

    }),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(configService: ConfigService) => 
      configService.get("typeorm")
    }),
    JwtModule.register({
      global:true,
      signOptions:{expiresIn:"1h"},
      secret:process.env.JWT_SECRET
    })
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
