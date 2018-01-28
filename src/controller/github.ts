import { Router } from 'express';

import githubEvent from '../service/githubEvent';
import '../eventHandler';

const router = Router();

router.post('/', (req, res, next) => {
  console.log(req.body);
  console.log(req.headers);

  const event = req.headers['x-github-event'];
  const action = req.body.action;
  const eventName = `${event}.${action}`;

  // emit return false if there are no event handlers registered to the given event
  if (!githubEvent.emit(eventName, req, res, next)) {
    return next();
  }
});

export default router;
