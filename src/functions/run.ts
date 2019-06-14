import { IProgram } from '../interfaces';
import { parseArgv } from '../functions';

export const run = (program: IProgram) => {
  const { action, args, props } = parseArgv(process.argv.slice(2));

  if (!action) {
    console.log('Usage: mvs <action>')
    return;
  }

  const p = program({ args });

  if (props.help) {
    const allArgs = p.actions[action].args ? `${p.actions[action].args.map(a => ` <${a.enum ? a.enum.join('|') : a.name}>`).join('')}` : '';
    console.log(`Usage: mvs ${action}${allArgs}`);
    return;
  }

  if (p.actions[action]) {
    p.actions[action].action(props);
  }
};
