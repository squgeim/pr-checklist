import axios from 'axios';
import parse = require('parse-diff');
import { Request, Response, NextFunction } from 'express';

import { getMatchingFileNames } from '../util/matchFileName';
import { githubEvent, prEvent } from '../service/githubEvent';

githubEvent.on(
  'pull_request.opened',
  (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;

    const pullRequestUrl = body.pull_request.url;

    axios({
      url: pullRequestUrl,
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.diff'
      }
    })
      .then(res => res.data)
      .then((diff: string) => parse(diff))
      .then(files => {
        console.log(files);

        const fileNames = files.map(file => file.to);
        const registeredFileNames = prEvent.eventNames();

        files.forEach(file => {
          getMatchingFileNames(registeredFileNames, file.to).map(
            (eventName: string) => prEvent.emit(eventName, file)
          );
        });

        res.json(files);
      })
      .catch(err => {
        console.error(err);
        res.json({
          error: true
        });
      });
  }
);
