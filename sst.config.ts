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
    const api = new sst.aws.ApiGatewayV2('StripeToQuickBooksApi');
    api.route('GET /', {
      handler: 'index.handler'
    });
    api.route('$default', 'index.handler');

    return {
      api: api.url
    };
  }
});
