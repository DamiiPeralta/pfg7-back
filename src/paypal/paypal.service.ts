import { Injectable } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';
import {config as dotenvConfig} from "dotenv"
dotenvConfig({path:".env.development"})

  @Injectable()
  export class PaypalService {
    private environment: paypal.core.SandboxEnvironment | paypal.core.LiveEnvironment;
    private client: paypal.core.PayPalHttpClient;
  
    constructor() {
      this.environment = new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_SECRET_KEY,
      );
      this.client = new paypal.core.PayPalHttpClient(this.environment);
    }
  
    async createOrder() {
      const request = new paypal.orders.OrdersCreateRequest();
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: '100.00',
            },
          },
        ],
      });
  
      const response = await this.client.execute(request);
      console.log('Order created: ', response.result);
      return response.result;
    }
  
    async captureOrder(orderId: string) {
      const request = new paypal.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});
      const response = await this.client.execute(request);
      console.log('Order captured: ', response.result);
      return response.result;
    }
  }
  