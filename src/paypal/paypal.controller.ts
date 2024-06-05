import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { PaypalService } from './paypal.service';

@Controller('paypal')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Post('create-order')
  async createOrder() {
    const order = await this.paypalService.createOrder();
    const approvalLink = order.links.find(link => link.rel === 'approve').href;
    return { id: order.id, approvalLink };
  }

  @Post('capture-order')
  async captureOrder(@Body('orderId') orderId: string) {
    try {
      const capture = await this.paypalService.captureOrder(orderId);
      return capture;
    } catch (error) {
      console.error('Error capturing order:', error);
      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
  
}
