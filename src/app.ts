import connectDB from './utils/connect';
import logger from './utils/logger';
import createServer from './utils/server';
import { restResponseTimeHistogram, startMetricServer } from './utils/metrics';
import responseTime from 'response-time';
const app = createServer();
// Server Setup
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

// @ts-ignore
app.use(
  responseTime(function (req, res, time) {
    //@ts-ignore
    if (req?.route?.path) {
      restResponseTimeHistogram.observe(
        {
          method: req.method,
          // @ts-ignore
          route: req.route.path,
          status_code: res.statusCode,
        },
        time * 1000,
      );
    }
  }),
);
app.listen(PORT, () => {
  logger.info(`App is started listening on PORT: ${PORT} in ${NODE_ENV} mode`);
  connectDB();
  startMetricServer();
});
