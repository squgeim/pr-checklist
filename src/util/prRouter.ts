import { File } from 'parse-diff';

import PullRequest from './pullRequest';
import { getMatchingFileNames } from './matchFileName';

/**
 * The callback function receives a list of file objects that match the filename.
 *
 * This function can use from the file object and the diff within to decide what
 * checklist to show.
 *
 * The string returned will ideally be a markdown list (or a checklist).
 *
 * Unordered List:
 *
 * - item
 * - item
 *
 * Ordered List:
 *
 * 1. item
 * 2. item
 *
 * Checklist:
 *
 * - [ ] item
 * - [x] completed item
 */
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
