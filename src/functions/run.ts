import chalk from 'chalk';

import { IArg, IProgram } from '../interfaces';
import { parseArgv } from '../functions';

export const run = async (program: IProgram) => {
  try {
    const programName = process.argv[1].split('/').slice(-1)[0];
    const { action, args, props } = parseArgv(process.argv.slice(2));

    const p = program({ args });

    if (!action) {
      console.log(`Usage:\n\n${programName} <action>\n`)
      console.log('Actions:\n');
      Object.keys(p.actions).forEach((actionName) => {
        console.log(`- ${actionName}`);
      });
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
      const allArgs = p.actions[action].args ? p.actions[action].args.map(parseArg).join('') : '';
      console.log(`Usage: ${programName} ${action}${allArgs}`);
      return;
    }

    if (p.actions[action]) {
      if (p.actions[action].args) {
        p.actions[action].args.forEach((arg, index) => {
          if (arg.enum && (arg.required || args[index]) && !arg.enum.includes(args[index])) {
            throw new Error(`<${arg.name}> must be one of the following: ${arg.enum.join(', ')}`);
          } else if (arg.required && !args[index]) {
            throw new Error(`<${arg.name}> is required`);
          }
        });
      }
      await p.actions[action].action(props);
    }
  } catch (error) {
    console.log(chalk.red(`ERROR: ${error.message}`));
  }
};
