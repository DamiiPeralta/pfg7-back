import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env.development' });

@Injectable()
export class MailchimpService {
  private readonly apiKey: string;
  private readonly serverPrefix: string;
  private readonly audienceId: string;
  private readonly logger = new Logger(MailchimpService.name);

  constructor(
    private readonly httpService: HttpService,
  ) {
    this.apiKey = process.env.MAILCHIMP_API_KEY;
    this.serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
    this.audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  }

  addSubscriber(email: string, firstName: string, lastName: string): Observable<any> {
    const url = `https://${this.serverPrefix}.api.mailchimp.com/3.0/lists/${this.audienceId}/members`;
    const data = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
    };

    const auth = Buffer.from(`anystring:${this.apiKey}`).toString('base64');
    
    this.logger.log(`Sending request to Mailchimp: ${url}`);
    this.logger.debug(`Request data: ${JSON.stringify(data)}`);

    return this.httpService.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
    }).pipe(
      map(response => {
        this.logger.log('Subscriber added successfully');
        return {
          message: 'Subscriber added successfully',
          data: response.data,
        };
      }),
      catchError(error => {
        this.logger.error('Error adding subscriber to Mailchimp', error.response?.data || error.message);
        throw new InternalServerErrorException('Error adding subscriber to Mailchimp', error.response?.data || error.message);
      }),
    );
  }
}
