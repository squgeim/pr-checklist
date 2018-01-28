import { File } from 'parse-diff';

import PullRequest from './pullRequest';
import { getMatchingFileNames } from './matchFileName';

type CallbackFn = (file?: File[], pullRequest?: PullRequest) => string;

interface CallbacksMap {
  [fileRegx: string]: CallbackFn;
}

interface CallbackFilename {
  fileNames: string[];
  cb: CallbackFn;
}

const callbacks: CallbacksMap = {};

function add(fileRegx: string, callback: CallbackFn) {
  callbacks[fileRegx] = callback;
  console.log('Added callback', callbacks);
}

function getCallbacks(files: string[]) {
  const callbackKeys = Object.keys(callbacks);

  const collection: { [key: string]: string[] } = {};

  const keyFileNameMap = files
    .map(fileName => ({
      fileName,
      keys: getMatchingFileNames(callbackKeys, fileName)
    }))
    .reduce((acc, { fileName, keys }) => {
      keys.forEach(key => {
        if (acc[key] === undefined) {
          acc[key] = [];
        }

        acc[key].push(fileName);
      });

      return acc;
    }, collection);

  return Object.keys(keyFileNameMap).map(key => ({
    fileNames: keyFileNameMap[key],
    cb: callbacks[key],
    key
  }));
}

export default {
  add,
  getCallbacks
};
