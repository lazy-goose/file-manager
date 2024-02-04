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

/**
 * @typedef {{
 *   length?: number
 *   strictLength?: boolean
 *   falsy?: boolean
 *   error?: Error | null | boolean
 * }} UserOptions
 *
 * @param {string[]} args
 * @returns {{
 *   withOptions: (userOptions?: UserOptions | Record<string, never>) => boolean | never
 * }}
 */
const validateArgs = (args) => ({
  withOptions: (userOptions = {}) => {
    const {
      length: maxLength = -1,
      strictLength = true,
      falsy = false,
      error = InvalidInput,
    } = userOptions;

    const falseExit = (msg = '') => {
      if (typeof error === 'function') {
        throw new error(msg);
      }
      return false;
    };

    if (maxLength !== -1) {
      const errorMsg = `expected ${maxLength} argument${
        maxLength > 1 ? 's' : ''
      }, but got ${args.length}`;
      if (strictLength && args.length !== maxLength) {
        return falseExit(errorMsg);
      }
      if (!strictLength && args.length > maxLength) {
        return falseExit(errorMsg);
      }
    }

    if (!falsy && !args.every(Boolean)) {
      const errorMsg = 'has falsy argument';
      return falseExit(errorMsg);
    }

    return true;
  },
});

export { resolvePath, parseInputString, validateArgs };
