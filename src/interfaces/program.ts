import { IAction } from './action';
import { IArg } from './arg';

export interface IProgram<P = {}> {
  (props: P & { args?: string[] }): IProgramConfig;
}

export interface IProgramConfig {
  name: string;
  version: string;
  actions: {
    [name: string]: {
      action: IAction;
      args?: IArg[];
      flags?: string[];
    };
  };
}
