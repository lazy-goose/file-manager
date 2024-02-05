import { promises as fs, createReadStream, createWriteStream } from 'fs';
import { resolvePath } from '../utils.js';
import { InvalidInput } from '../errors.js';
import stream from 'stream/promises';
import path from 'path';

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
 * @description Delete file
 */
const rm = async (pathToFile) => {
  await fs.rm(resolvePath(pathToFile), { recursive: true });
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
  if (path.relative(pathToFile, newPathToFile)) {
    await rm(pathToFile);
  }
};

/**
 * @param {string} toBeDirectory
 */
const throwIfNotADirectory = async (toBeDirectory) => {
  const error = new InvalidInput(`expected to be a folder: ${toBeDirectory}`);
  try {
    const stat = await fs.lstat(toBeDirectory);
    if (!stat.isDirectory()) {
      throw error;
    }
  } catch {
    throw error;
  }
};

/**
 * @param {string} pathToFile
 * @param {string} pathToNewFolder
 * @param {boolean} force
 * @description Copy file to folder (+Readable, +Writable stream)
 */
const cpToFolder = async (pathToFile, pathToNewFolder, force = false) => {
  await throwIfNotADirectory(pathToNewFolder);

  const srcPath = resolvePath(pathToFile);
  const srcFilename = path.basename(srcPath);

  let dstFilename = srcFilename;
  if (!force) {
    const entries = await fs.readdir(pathToNewFolder);
    let uniqueName = srcFilename;
    let counter = 0;
    do {
      uniqueName = srcFilename + (counter ? '-copy' + counter : '');
      counter++;
    } while (entries.includes(uniqueName));
    dstFilename = uniqueName;
  }

  const dstPath = resolvePath(pathToNewFolder, dstFilename);

  const readStream = createReadStream(srcPath);
  const writeStream = createWriteStream(dstPath);
  await stream.pipeline(readStream, writeStream);

  return dstPath;
};

/**
 * @param {string} pathToFile
 * @param {string} pathToNewFolder
 * @description Copy file to folder (+Readable, +Writable stream)
 */
const mvToFolder = async (pathToFile, pathToNewFolder) => {
  const newFilePath = await cpToFolder(pathToFile, pathToNewFolder, true);
  if (path.relative(pathToFile, newFilePath)) {
    await rm(pathToFile);
  }
};

export default {
  cat,
  add,
  rn,
  rm,
  cp,
  mv,
  cpToFolder,
  mvToFolder,
};
