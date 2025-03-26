import type { APIGatewayProxyEventV2 } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEventV2) => {
  console.log(event);
  return {
    statusCode: 200,
    body: JSON.stringify({ route: event.routeKey, status: 'ok' }, null, 2)
  };
};
