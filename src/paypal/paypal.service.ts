import { Injectable } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';

@Injectable()
export class PayPalService {
  private environment: paypal.core.SandboxEnvironment | paypal.core.LiveEnvironment;
  private client: paypal.core.PayPalHttpClient;

  constructor() {
    this.environment = new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET,
    );
    this.client = new paypal.core.PayPalHttpClient(this.environment);
  }

  async createOrder(amount: number, currency: string = 'USD'): Promise<any> {
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toString(),
          },
        },
      ],
    });

    try {
      const response = await this.client.execute(request);
      return response.result;
    } catch (err) {
      console.error(err);
      throw new Error('Error creating PayPal order');
    }
  }

  async captureOrder(orderId: string): Promise<any> {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
      const response = await this.client.execute(request);
      return response.result;
    } catch (err) {
      console.error(err);
      throw new Error('Error capturing PayPal order');
    }
  }
}
