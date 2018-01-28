import axios from 'axios';
import * as parse from 'parse-diff';

const TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
  throw Error('Github token not initialized');
}

const githubHttp = axios.create({
  headers: {
    Authorization: `token ${TOKEN}`
  }
});

interface PullRequestObj {
  url: string;
  id: number;
  number: number;
  issue_url: string;
  state: string;
  title: string;
  review_comments_url: string;
  comments_url: string;
}

class PullRequest {
  pr: PullRequestObj;

  constructor(pr: PullRequestObj) {
    this.pr = pr;
    console.log('PR', this.pr);
  }

  getDiff() {
    return githubHttp
      .get(this.pr.url, {
        headers: {
          Accept: 'application/vnd.github.diff'
        }
      })
      .then(res => res.data)
      .then((diff: string) => parse(diff));
  }

  postComment(body: string) {
    return githubHttp
      .post(this.pr.comments_url, {
        body
      })
      .then(res => res.data);
  }
}

export default PullRequest;
