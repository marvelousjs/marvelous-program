export interface IAction<P = {}> {
  (props: P & { default?: boolean }): void;
}
