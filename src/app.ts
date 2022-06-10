import connectDB from './utils/connect';
import logger from './utils/logger';
import createServer from './utils/server';

const app = createServer();
// Server Setup
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;
app.listen(PORT, () => {
  logger.info(`App is started listening on PORT: ${PORT} in ${NODE_ENV} mode`);
  connectDB();
});
