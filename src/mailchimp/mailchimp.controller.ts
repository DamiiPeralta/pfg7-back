import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MailchimpService } from './mailchimp.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MailchimpDto } from './mailchimp.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/roles/roles.enum';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';

@ApiTags('Newsletter')
@Controller('newsletter')
export class MailchimpController {
  constructor(private readonly mailchimpService: MailchimpService) {}

  @Post('subscribe')
  // @Roles(Role.User, Role.Admin)
  // @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Suscribes a user to the Newsletter',
    description:
      'Expects the email, firstName and lastName in the body of the request. Returns a success or error message.',
  })
  async subscribe(@Body() body: MailchimpDto) {
    const { email, firstName, lastName } = body;
    const response = await this.mailchimpService
      .addSubscriber(email, firstName, lastName)
      .toPromise();
    return response;
  }
}
