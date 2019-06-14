import chalk from 'chalk';

import { IArg, IProgram } from '../interfaces';
import { parseArgv } from '../functions';

export const run = (program: IProgram) => {
  try {
    const { action, args, props } = parseArgv(process.argv.slice(2));

    if (!action) {
      console.log('Usage: mvs <action>')
      return;
    }

    const p = program({ args });

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
      console.log(`Usage: mvs ${action}${allArgs}`);
      return;
    }

    if (p.actions[action]) {
      if (p.actions[action].args) {
        p.actions[action].args.forEach((arg, index) => {
          if (arg.required && !args[index]) {
            throw new Error(`<${arg.name}> is required`);
          } else if (arg.enum && !arg.enum.includes(args[index])) {
            throw new Error(`<${arg.name}> must be one of the following: ${arg.enum.join(', ')}`);
          }
        });
      }
      p.actions[action].action(props);
    }
  } catch (error) {
    console.log(chalk.red(`ERROR: ${error.message}`));
  }
};
