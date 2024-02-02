import process from 'process';
import * as readline from 'readline/promises';
import store from './store.js';

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
  rl.on('line', (input) => {
    switch (input.trimEnd()) {
      case '.exit':
        rl.close();
      default:
        console.log('Unknown command');
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
