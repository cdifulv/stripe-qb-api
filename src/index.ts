import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Resource } from 'sst';
import Stripe from 'stripe';

export const handler = async (event: APIGatewayProxyEventV2) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: 'No event body'
    };
  }

  if (!event.headers['stripe-signature']) {
    return {
      statusCode: 400,
      body: 'No Stripe-Signature header'
    };
  }

  const stripe = new Stripe(Resource.StripeDevSecretKey.value);
  const sig = event.headers['stripe-signature'];
  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      Resource.StripeDevWebhookSecret.value
    );
  } catch (err) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }

  switch (stripeEvent.type) {
    case 'invoice.paid': {
      const invoice = stripeEvent.data.object;
      console.log(invoice);
      break;
    }
    default:
      console.log(`Unhandled event type ${stripeEvent.type}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ route: event.routeKey, status: 'ok' }, null, 2)
  };
};
