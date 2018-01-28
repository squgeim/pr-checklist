import * as express from 'express';
import * as env from 'dotenv';
import * as bodyparser from 'body-parser';

env.config();

import routes from './controller';
import notImplemented from './errorHandler/notImplemented';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyparser.json());
app.use('/', routes);
app.use(notImplemented);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

export default app;
