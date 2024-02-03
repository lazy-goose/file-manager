import crypto from 'crypto';
import stream from 'stream/promises';
import { promises as fs, createReadStream } from 'fs';
import { resolvePath } from '../utils.js';

/**
 * @param {string} fileToPath
 * @param {string} algorithm
 * @description Calculate hash for file and print it into console
 */
const digest = async (fileToPath, algorithm = 'sha256') => {
  const readStream = createReadStream(resolvePath(fileToPath));
  const hash = crypto.createHash(algorithm);
  await stream.pipeline(readStream, hash);
  console.log(hash.digest('hex'));
};

export default {
  digest,
};
