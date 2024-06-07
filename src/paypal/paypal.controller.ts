import { Controller, Post, Body, Param } from '@nestjs/common';
import { PayPalService } from './paypal.service';

@Controller('paypal')
export class PayPalController {
  constructor(private readonly paypalService: PayPalService) {}

  @Post('create-order')
  async createOrder(@Body('amount') amount: number) {
    return this.paypalService.createOrder(amount);
  }

  @Post('capture-order/:orderId')
  async captureOrder(@Param('orderId') orderId: string) {
    return this.paypalService.captureOrder(orderId);
  }
}
