import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

export interface EnabledEvent {
  name: string;
}

@Injectable()
export class StripeService {
  private stripeClient: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripeClient = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2023-10-16',
      },
    );
  }

  async createCheckoutSession(
    userId: string,
    subName: string,
    amount: number,
    email: string,
  ): Promise<{ redirectUrl: string }> {
    const domainUrl = `${process.env.HOST_URL}`;

    try {
      const checkoutSession = await this.stripeClient.checkout.sessions.create({
        success_url: `${domainUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${domainUrl}/cancelled`,
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: amount,
              product_data: {
                name: subName,
              },
            },
            quantity: 1,
          },
        ],
        client_reference_id: email,
        metadata: {
          sub_name: subName,
          userId: userId,
        },
      });
      return { redirectUrl: checkoutSession.url };
    } catch (error) {
      throw error;
    }
  }
}
