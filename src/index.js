import process from 'process';
import * as readline from 'readline/promises';
import os from 'os';
import store from './store.js';
import { InvalidInput, OperationFailed } from './errors.js';
import navigation from './modules/navigation.js';
import osStats from './modules/osStats.js';
import fileSystem from './modules/fileSystem.js';
import hash from './modules/hash.js';
import compression from './modules/compression.js';
import { parseInputString, validateArgs } from './utils.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

/**
 * @param {string} fallback
 */
const getUsernameArgument = (fallback) => {
  const argPos = process.argv.indexOf('--username');
  return argPos !== -1 ? process.argv[argPos + 1] || fallback : fallback;
};

const init = () => {
  rl.on('line', async (initialLine) => {
    try {
      const line = initialLine.trimEnd();
      const [cmd, ...args] = parseInputString(line);

      const afterEachSuccess = () => {
        navigation.pwd();
      };

      switch (cmd) {
        case '.exit':
          rl.close();
          return;
        case 'clear':
          console.clear();
          break;
        case 'ls':
          await navigation.ls();
          break;
        case 'pwd':
          navigation.pwd();
          break;
        case 'up':
          navigation.cdParent();
          break;
        case 'cd':
          validateArgs(args).withOptions({ length: 1 });
          navigation.cd(args[0]);
          break;
        case 'os':
          validateArgs(args).withOptions({ length: 1 });
          switch (args[0]) {
            case '--EOL':
              osStats.eol();
              break;
            case '--cpus':
              osStats.cpus();
              break;
            case '--homedir':
              osStats.homedir();
              break;
            case '--username':
              osStats.username();
              break;
            case '--architecture':
              osStats.arch();
              break;
            default:
              throw new InvalidInput('unknown os command argument');
          }
          break;
        case 'cat':
          validateArgs(args).withOptions({ length: 1 });
          await fileSystem.cat(args[0]);
          break;
        case 'add':
          validateArgs(args).withOptions({ length: 1 });
          await fileSystem.add(args[0]);
          break;
        case 'rn':
          validateArgs(args).withOptions({ length: 2 });
          await fileSystem.rn(args[0], args[1]);
          break;
        case 'cp':
          validateArgs(args).withOptions({ length: 2 });
          await fileSystem.cp(args[0], args[1]);
          break;
        case 'mv':
          validateArgs(args).withOptions({ length: 2 });
          await fileSystem.mv(args[0], args[1]);
          break;
        case 'rm':
          validateArgs(args).withOptions({ length: 1 });
          await fileSystem.rm(args[0]);
          break;
        case 'hash':
          validateArgs(args).withOptions({ length: 1 });
          await hash.digest(args[0]);
          break;
        case 'compress':
          validateArgs(args).withOptions({ length: 2 });
          await compression.compress(args[0], args[1]);
          break;
        case 'decompress':
          validateArgs(args).withOptions({ length: 2 });
          await compression.decompress(args[0], args[1]);
          break;
        default:
          throw new InvalidInput('unknown command');
      }
      navigation.pwd();
    } catch (e) {
      if (e instanceof InvalidInput || e instanceof OperationFailed) {
        console.log(e.message);
        return;
      }
      console.log(new OperationFailed(e.message).message);
    } finally {
      rl.prompt();
    }
  })
    .on('SIGINT', () => {
      console.log();
      rl.close();
    })
    .on('close', () => {
      const Username = store.getValue('username');
      console.log(`Thank you for using File Manager, ${Username}, goodbye!`);
      process.exit(0);
    });

  process.chdir(os.homedir());

  const Username = getUsernameArgument('Unknown');
  store.setValue('username', Username);

  console.log(`Welcome to the File Manager, ${Username}!`);
  console.log();
  navigation.pwd();

  rl.prompt();
};

init();
