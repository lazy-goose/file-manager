import path from 'path';
import os from 'os';

/**
 * @param {string} filePath
 */
export const resolvePath = (filePath) => {
  return path.resolve(filePath.replace('~', os.homedir()));
};
