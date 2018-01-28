import axios from 'axios';
import * as Promise from 'es6-promise';
import { Request, Response, NextFunction } from 'express';
import { INTERNAL_SERVER_ERROR, CREATED } from 'http-status-codes';

import PullRequest from '../util/pullRequest';
import { getMatchingFileNames } from '../util/matchFileName';
import { githubEvent } from '../service/githubEvent';
import prRouter from '../util/prRouter';

githubEvent.on(
  'pull_request.opened',
  (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;

    const pullRequest = new PullRequest(body.pull_request);

    pullRequest
      .getDiff()
      .then(files => {
        console.log(files);

        const fileNames = files.map(file => file.to);

        const checklists: string[] = [];

        const callbacks = prRouter.getCallbacks(fileNames);

        callbacks.forEach(cbObj => {
          checklists.push(
            `## ${cbObj.key}`,
            cbObj.cb(
              files.filter(file => cbObj.fileNames.includes(file.to)),
              pullRequest
            )
          );
        });

        if (!checklists) {
          return res.json({
            data: 'No handlers assigned to changed files'
          });
        }

        const comment = [
          "Lets make sure we don't miss anything. Here's a quick checklist:",
          '',
          ...checklists
        ].join('\n');

        console.log(`Comment Posted for PR #${pullRequest.pr.number}`);
        console.log(comment);

        pullRequest
          .postComment(comment)
          .then(response => {
            console.log('response', response);
            res.status(CREATED).json({
              data: {
                success: true,
                message: 'Comment Posted',
                id: response.id,
                url: response.url
              }
            });
          })
          .catch(err => {
            console.error('post comment error', err);
            res.status(INTERNAL_SERVER_ERROR).json({
              error: true,
              message: 'Could not post comment'
            });
          });
      })
      .catch(err => {
        console.error('get diff error', err);
        res.json({
          error: true
        });
      });
  }
);
