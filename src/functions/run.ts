import chalk from 'chalk';
import * as forEach from 'p-map';

import { IArg, IProgram } from '../interfaces';
import { formatArg, parseArgv } from '../functions';

export const run = async (program: IProgram) => {
  try {
    const argv = process.argv;

    let programName = argv[1].split('/').slice(-1)[0];
    if (programName.includes('-')) {
      const parts = programName.split('-');
      programName = parts[0];
      if (parts[1]) {
        argv[3] = parts[1];
      }
      if (parts[2]) {
        argv[4] = parts[2];
      }
    }

    const { actionNames, args, props } = parseArgv(argv.slice(2));

    const p = program({ args });

    if (actionNames.length === 0 || actionNames.includes('help')) {
      console.log(`Usage:\n\n${chalk.bold(programName)} <action>\n`)
      console.log('Actions:\n');
      Object.entries(p.actions).forEach(([actionName, action]) => {
        const description = action.description ? chalk.gray(action.description) : '';
        console.log(`- ${chalk.bold(actionName)} ${action.args.map(arg => formatArg(arg)).join(' ')} ${description}`);
      });
      return;
    }

    actionNames.forEach((actionName) => {
      if (!p.actions[actionName]) {
        throw new Error('Action does not exist.');
      }  
    });

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
      
      actionNames.forEach((actionName) => {
        const allArgs = p.actions[actionName].args ? p.actions[actionName].args.map(parseArg).join('') : '';
        console.log(`Usage: ${programName} ${actionName}${allArgs}`);
      });
      return;
    }

    await forEach(actionNames, async (actionName) => {
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
    }, { concurrency: 1 });

  } catch (error) {
    console.log(chalk.red(`ERROR: ${error.message}`));
  }
};
