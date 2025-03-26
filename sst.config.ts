/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'stripe-qb-api',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'aws'
    };
  },
  async run() {
    const stripeDevSecretKey = new sst.Secret('StripeDevSecretKey');
    const stripeDevWebhookSecret = new sst.Secret('StripeDevWebhookSecret');
    const api = new sst.aws.ApiGatewayV2('StripeToQuickBooksApi');
    api.route('POST /webhook', {
      handler: 'src/index.handler',
      link: [stripeDevSecretKey, stripeDevWebhookSecret]
    });

    return {
      api: api.url
    };
  }
});
