import { promises as fs, createReadStream, createWriteStream } from 'fs';
import { resolvePath } from '../utils.js';
import stream from 'stream/promises';

/**
 * @param {string} pathToFile
 * @description Read file and print it's content in console (+Readable stream)
 */
const cat = async (pathToFile) => {
  return new Promise((resolve, reject) => {
    const readStream = createReadStream(resolvePath(pathToFile));
    readStream.on('data', (chunk) => console.log(chunk.toString()));
    readStream.on('error', reject);
    readStream.on('close', resolve);
  });
};

/**
 * @param {string} newFileName
 * @description Create empty file in current working directory
 */
const add = async (newFileName) => {
  let file;
  try {
    file = await fs.open(newFileName, 'ax');
  } finally {
    file?.close();
  }
};

/**
 * @param {string} pathToFile
 * @param {string} newFileName
 * @description Rename file
 */
const rn = async (pathToFile, newFileName) => {
  await fs.rename(resolvePath(pathToFile), newFileName);
};

/**
 * @param {string} pathToFile
 * @param {string} newPathToFile
 * @description Copy file (+Readable, +Writable streams)
 */
const cp = async (pathToFile, newPathToFile) => {
  const readStream = createReadStream(resolvePath(pathToFile));
  const writeStream = createWriteStream(resolvePath(newPathToFile));
  await stream.pipeline(readStream, writeStream);
};

/**
 * @param {string} pathToFile
 * @param {string} newPathToFile
 * @description Move file (same as copy but initial file is deleted, +Readable, +Writable stream)
 */
const mv = async (pathToFile, newPathToFile) => {
  await cp(pathToFile, newPathToFile);
  await rm(pathToFile);
};

/**
 * @param {string} pathToFile
 * @description Delete file
 */
const rm = async (pathToFile) => {
  await fs.rm(resolvePath(pathToFile), { recursive: true });
};

export default {
  cat,
  add,
  rn,
  cp,
  mv,
  rm,
};
