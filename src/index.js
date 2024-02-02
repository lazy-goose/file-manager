import process from 'process';
import * as readline from 'readline/promises';
import store from './store.js';
import './modules/navigation.js';
import navigation from './modules/navigation.js';

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
    const line = initialLine.trimEnd();
    const [cmd, ...args] = line.split(' ');
    try {
      switch (cmd) {
        case '.exit':
          rl.close();
          return;
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
          navigation.cd(args[0]);
          break;
        default:
          console.log('Unknown command');
      }
      navigation.pwd();
    } catch (e) {
      throw e;
      console.log('Operation failed');
    }
    rl.prompt();
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

  const Username = getUsernameArgument('Unknown');
  store.setValue('username', Username);

  console.log(`Welcome to the File Manager, ${Username}!`);
  rl.prompt();
};

init();
