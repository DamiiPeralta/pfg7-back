import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {config as dotenvConfig} from "dotenv"
dotenvConfig({path:".env.development"})

@Injectable()
export class MailchimpService {
  private readonly apiKey: string;
  private readonly serverPrefix: string;
  private readonly audienceId: string;

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

    return this.httpService.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
    }).pipe(
      map(response => ({
        message: 'Subscriber added successfully',
        data: response.data,
      })),
      catchError(error => {
        throw new InternalServerErrorException('Error adding subscriber to Mailchimp', error.message);
      }),
    );
  }
}
