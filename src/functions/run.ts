import chalk from 'chalk';

import { IArg, IProgram } from '../interfaces';
import { formatArg, parseArgv } from '../functions';

export const run = async (program: IProgram) => {
  try {
    const programName = process.argv[1].split('/').slice(-1)[0];
    const { actionName, args, props } = parseArgv(process.argv.slice(2));

    const p = program({ args });

    if (!actionName || actionName === 'help') {
      console.log(`Usage:\n\n${chalk.bold(programName)} <action>\n`)
      console.log('Actions:\n');
      Object.entries(p.actions).forEach(([actionName, action]) => {
        const description = action.description ? chalk.gray(action.description) : '';
        console.log(`- ${chalk.bold(actionName)} ${action.args.map(arg => formatArg(arg)).join(' ')} ${description}`);
      });
      return;
    }

    if (!p.actions[actionName]) {
      throw new Error('Action does not exist.');
    }

    if (args.length === 0) {
      const action = p.actions[actionName];
      console.log(`Usage:\n\n${chalk.bold(programName)} ${chalk.bold(actionName)} ${action.args.map(arg => formatArg(arg, true)).join(' ')}`);
      if (action.description) {
        console.log('\nDescription:\n');
        console.log(chalk.bold(action.description));
      }
      return;
    }

    if (props.help) {
      const parseArg = (arg: IArg) => {
        let output = ' ';
        output += arg.required ? '<' : '[';
        if (arg.enum) {
          output += arg.enum.join('|');
        } else {
          output += arg.name;
        }
        output += arg.required ? '>' : ']';
        return output;
      };
      const allArgs = p.actions[actionName].args ? p.actions[actionName].args.map(parseArg).join('') : '';
      console.log(`Usage: ${programName} ${actionName}${allArgs}`);
      return;
    }

    if (p.actions[actionName]) {
      if (p.actions[actionName].args) {
        p.actions[actionName].args.forEach((arg, index) => {
          if (arg.enum && (arg.required || args[index]) && !arg.enum.includes(args[index])) {
            throw new Error(`<${arg.name}> must be one of the following: ${arg.enum.join(', ')}`);
          } else if (arg.required && !args[index]) {
            throw new Error(`<${arg.name}> is required`);
          }
        });
      }
      await p.actions[actionName].action(props);
    }
  } catch (error) {
    console.log(chalk.red(`ERROR: ${error.message}`));
  }
};
