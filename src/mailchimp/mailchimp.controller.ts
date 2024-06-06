import { Controller, Post, Body } from '@nestjs/common';
import { MailchimpService } from './mailchimp.service';

@Controller('newsletter')
export class MailchimpController {
  constructor(private readonly mailchimpService: MailchimpService) {}

  @Post('subscribe')
  async subscribe(@Body() body: { email: string; firstName: string; lastName: string }) {
    const { email, firstName, lastName } = body;
    const response = await this.mailchimpService.addSubscriber(email, firstName, lastName).toPromise();
    return response;
  }
}
