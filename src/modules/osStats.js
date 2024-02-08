import os from 'os';

/**
 * @description Get EOL (default system End-Of-Line) and print it to console
 */
const eol = () => {
  console.log(os.EOL);
};

/**
 * @description Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for each of them) and print it to console
 */
const cpus = () => {
  console.table(
    os.cpus().map((cpu) => ({
      model: cpu.model,
      clockRate: cpu.speed / 1000 + 'GHz',
    }))
  );
};

/**
 * @description Get home directory and print it to console
 */
const homedir = () => {
  console.log(os.homedir());
};

/**
 * @description Get current system user name and print it to console
 */
const username = () => {
  console.log(os.userInfo().username);
};

/**
 * @description Get CPU architecture for which Node.js binary has compiled and print it to console
 */
const arch = () => {
  console.log(os.arch());
};

export default {
  eol,
  cpus,
  homedir,
  username,
  arch,
};
