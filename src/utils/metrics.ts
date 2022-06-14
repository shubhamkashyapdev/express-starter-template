import express from 'express';
import client from 'prom-client';
import logger from './logger';
const app = express();

export const restResponseTimeHistogram = new client.Histogram({
  name: 'rest_response_time_duration_seconds',
  help: 'REST API RESPONSE TIME IN SECONDS',
  labelNames: ['method', 'route', 'status_code'],
});

export const databaseResponseTimeHistogram = new client.Histogram({
  name: 'db_response_time_duration_seconds',
  help: 'DATABSE RESPONSE TIME IN SECONDS',
  labelNames: ['operation', 'success'],
});

export function startMetricServer() {
  console.log('//////////////// metrics intialized');
  const collectDefaultMetrics = client.collectDefaultMetrics;

  collectDefaultMetrics();
  app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', client.register.contentType);

    res.send(await client.register.metrics());
  });
  app.listen(9100, () => {
    logger.info('Metric server started at http://localhsot:9100');
  });
}
