import { IArg } from '../interfaces';

export const formatArg = (arg: IArg, includeEnum = false) => {
  let str = '';

  if (arg.required) {
    str += '<';
  } else {
    str += '[';
  }

  if (arg.enum && includeEnum) {
    str += arg.enum.join('|');
  } else {
    str += arg.name;
  }

  if (arg.required) {
    str += '>';
  } else {
    str += ']';
  }

  return str;
};
