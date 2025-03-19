import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/payment-session.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async createPaymentSession(@Body() paymentSessionDto: PaymentSessionDto) {
    return await this.paymentsService.createPaymentSession(paymentSessionDto);
  }
  @Post('webhook')
  async paymentStripe(@Req() req: Request, @Res() res: Response) {
    return await this.paymentsService.stripeWebhook(req, res);
  }
  @Get('success')
  success() {
    return {
      ok: true,
      message: 'Payment successfully',
    };
  }
  @Get('cancelled')
  cancel() {
    return {
      ok: true,
      message: 'Payment cancelled',
    };
  }
}
