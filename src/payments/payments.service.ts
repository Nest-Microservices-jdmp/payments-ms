/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.STRIPE_SECRET);

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items, orderId } = paymentSessionDto;
    const lineItems = items.map((item) => {
      return {
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const session: Stripe.Response<Stripe.Checkout.Session> =
      await this.stripe.checkout.sessions.create({
        payment_intent_data: {
          metadata: {
            orderId: orderId,
          },
        },
        line_items: lineItems,
        mode: 'payment',
        success_url: envs.SUCCESS_URL,
        cancel_url: envs.CANCEL_URL,
      });
    return session;
  }

  async stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;

    // Real
    const endpointSecret = envs.STRIPE_ENDPOINT_SECRET;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig!,
        endpointSecret,
      );
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case 'charge.succeeded': {
        const chargeSucceeded: Stripe.Charge = event.data.object;
        console.log({
          orderId: chargeSucceeded.metadata.orderId,
        });
        break;
      }

      default:
        console.log(`Event ${event.type} not handled`);
    }

    return res.status(200).json({ sig });
  }
}
