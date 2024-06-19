import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from './config/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { TeamModule } from './team/team.module';
import { AuthModule } from './auth/auth.module';
import { FileUploadModule } from './file_upload/file_upload.module';
import { SprintModule } from './sprint/sprint.module';
import { MailchimpModule } from './mailchimp/mailchimp.module';
import { SeederModule } from './seeder/seeder.module';
import { EmailModule } from './email/email.module';
import { MessageModule } from './message/message.module';
import { DonationModule } from './donation/donation.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
      secret: process.env.JWT_SECRET,
    }),
    AuthModule,
    UserModule,
    TaskModule,
    TeamModule,
    FileUploadModule,
    SprintModule,
    MailchimpModule,
    EmailModule,
    MessageModule,
    DonationModule,
    ChatModule,
    SeederModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
