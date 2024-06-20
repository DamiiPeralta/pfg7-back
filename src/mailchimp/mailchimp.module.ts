import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MailchimpService } from './mailchimp.service';
import { MailchimpController } from './mailchimp.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [MailchimpService],
  controllers: [MailchimpController],
})
export class MailchimpModule {}
