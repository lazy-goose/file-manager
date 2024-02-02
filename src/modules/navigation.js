import os from 'os';
import fs from 'fs/promises';

process.chdir(os.homedir());

/**
 * @description Print current working directory
 */
const pwd = () => {
  console.log(`You are currently in ${process.cwd()}`);
};

/**
 * @description Go upper from current directory (when you are in the root folder this operation shouldn't change working directory)
 */
const cdParent = () => {
  process.chdir('..');
};

/**
 * @param {string} directory
 * @description Go to dedicated folder from current directory (path argument can be relative or absolute)
 */
const cd = (directory) => {
  process.chdir(directory.replace('~', os.homedir()));
};

/**
 * @enum {string}
 */
const FileType = {
  Directory: 'directory',
  File: 'file',
  SymbolicLink: 'symbolic link',
  Unknown: 'unknown',
};

/**
 * @description Print in console list of all files and folders in current directory in table format
 */
const ls = async () => {
  const entries = await fs.readdir(process.cwd(), {
    withFileTypes: true,
  });
  const printTable = entries
    .map((entry) => {
      /**
       * @type {[FileType, boolean][]}
       */
      const fileTypes = [
        [FileType.File, entry.isFile()],
        [FileType.Directory, entry.isDirectory()],
        [FileType.SymbolicLink, entry.isSymbolicLink()],
      ];

      const [fileType = FileType.Unknown] =
        fileTypes.find(([_, type]) => type) || [];

      return [entry.name, fileType];
    })
    .sort((a, b) => {
      const [aName, aType] = a;
      const [bName, bType] = b;

      const orderFactor = [
        FileType.Directory,
        FileType.File,
        FileType.SymbolicLink,
        FileType.Unknown,
      ];

      const aOrder = orderFactor.indexOf(aType);
      const bOrder = orderFactor.indexOf(bType);

      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }

      return aName.localeCompare(bName);
    })
    .map(([name, type]) => ({ Name: name, Type: type }));

  if (!printTable.length) {
    console.table('No entries');
    return;
  }
  console.table(printTable);
};

export default {
  pwd,
  cdParent,
  cd,
  ls,
};
