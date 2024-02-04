import path from 'path';
import os from 'os';
import { InvalidInput } from './errors.js';

/**
 * @param {string} filePath
 */
const resolvePath = (filePath) => {
  return path.resolve(filePath.replace('~', os.homedir()));
};

/**
 * @param {string} inputString
 */
const parseInputString = (inputString) => {
  let out = [];
  let acc = '';
  let quote = '';
  for (let i = 0; i < inputString.length; i++) {
    let currCh = inputString[i];
    let nextCh = inputString[i + 1];
    // Escape character
    if (currCh === `\\`) {
      acc += nextCh || '';
      i++;
      continue;
    }
    // Start of quoted string
    if (!quote && [`"`, `'`].includes(currCh)) {
      quote = currCh;
      continue;
    }
    // End of quoted string
    if (quote && currCh === quote) {
      quote = '';
      continue;
    }
    // Argument delimiter
    if (!quote && currCh === ' ') {
      out.push(acc);
      acc = '';
      continue;
    }
    acc += currCh;
  }
  out.push(acc);
  if (quote) {
    throw new InvalidInput('unclosed quote');
  }
  return out;
};

export { resolvePath, parseInputString };
