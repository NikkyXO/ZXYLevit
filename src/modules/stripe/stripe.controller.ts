import { Controller, Req, Post, Header } from '@nestjs/common';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import { UserService } from '../user/user.service';

@Controller('webhook')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly userServie: UserService,
  ) {}

  @Header('Content-Type', 'application/json')
  @Post('stripe/')
  async handleWebhook(@Req() req: Request): Promise<any> {
    const signature = req.headers['stripe-signature'];
    let stripeEvent;
    try {
      stripeEvent = Stripe.webhooks.constructEvent(
        req.body as unknown as string,
        signature,
        process.env.STRIPE_WEBHOOK_SIGNING_KEY,
      );
      switch (stripeEvent.type) {
        case 'checkout.session.async_payment_failed':
          const checkoutSessionAsyncPaymentFailed = stripeEvent.data.object;
          console.log(checkoutSessionAsyncPaymentFailed);
          break;
        case 'checkout.session.async_payment_succeeded':
          const checkoutSessionAsyncPaymentSucceeded = stripeEvent.data.object;
          const userId = stripeEvent.data.object.metadata.userId;
          console.log(checkoutSessionAsyncPaymentSucceeded);
          this.userServie.updateUserPayment(userId);
          break;
        case 'checkout.session.completed':
          const checkoutSessionCompleted = stripeEvent.data.object;
          console.log(checkoutSessionCompleted);
          break;
        case 'checkout.session.expired':
          const checkoutSessionExpired = stripeEvent.data.object;
          console.log(checkoutSessionExpired);
          break;
        default:
          console.log(`Unhandled stripeEvent type ${stripeEvent.type}`);
      }
    } catch (err) {
      throw new Error(`Webhook Error: ${err.message}`);
    }
  }
}
