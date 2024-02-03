import { createReadStream, createWriteStream } from 'fs';
import stream from 'stream/promises';
import zlib from 'zlib';
import path from 'path';
import { resolvePath } from '../utils.js';
import { InvalidInput } from '../errors.js';

/**
 * @param {string} pathToFile
 * @param {string} pathToDestination
 * @description Compress file (Brotli algorithm, +Streams API)
 */
const compress = async (pathToFile, pathToDestination) => {
  if (path.extname(pathToDestination) !== '.br') {
    throw new InvalidInput('wrong destination file extension, expected .br');
  }
  const compressStream = zlib.createBrotliCompress();
  const readStream = createReadStream(resolvePath(pathToFile));
  const writeStream = createWriteStream(resolvePath(pathToDestination));
  await stream.pipeline(readStream, compressStream, writeStream);
};

/**
 * @param {string} pathToFile
 * @param {string} pathToDestination
 * @description Decompress file (Brotli algorithm, +Streams API)
 */
const decompress = async (pathToFile, pathToDestination) => {
  if (path.extname(pathToFile) !== '.br') {
    throw new InvalidInput('wrong source file extension, expected .br');
  }
  const decompressStream = zlib.createBrotliDecompress();
  const readStream = createReadStream(resolvePath(pathToFile));
  const writeStream = createWriteStream(resolvePath(pathToDestination));
  await stream.pipeline(readStream, decompressStream, writeStream);
};

export default {
  compress,
  decompress,
};
