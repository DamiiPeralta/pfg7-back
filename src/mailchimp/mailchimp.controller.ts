import { Controller, Post, Body } from '@nestjs/common';
import { MailchimpService } from './mailchimp.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('newsletter')
export class MailchimpController {
  constructor(private readonly mailchimpService: MailchimpService) {}

  @Post('subscribe')
  @ApiOperation({ summary: 'Suscribes a user to the Newsletter', 
    description: 'Expects the email, firstName and lastName in the body of the request. Returns a success or error message.'
   })
  async subscribe(@Body() body: { email: string; firstName: string; lastName: string }) {
    const { email, firstName, lastName } = body;
    const response = await this.mailchimpService.addSubscriber(email, firstName, lastName).toPromise();
    return response;
  }
}
