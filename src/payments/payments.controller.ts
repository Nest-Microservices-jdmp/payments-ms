import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern({ cmd: 'create.payment.session' })
  async createPaymentSession(
    @Payload(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    paymentSessionDto: PaymentSessionDto,
  ) {
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
