export function parseArgv(argv: string[]) {
  const actionName = argv[0];

  const { props, args }: { props: any; args: string[] } = argv.slice(1).reduce(
    (v, a) => {
      if (/^\-\-/.test(a)) {
        if (/=/.test(a)) {
          const parts = a.substr(2).split('=');
          const key = parts[0];
          const value = parts[1];
          (v.props as any)[key] = value;
        } else {
          const key = a.substr(2);
          (v.props as any)[key] = true;
        }
      } else {
        v.args.push(a);
      }
      return v;
    },
    { props: {}, args: [] }
  );

  const object = {
    actionName,
    props,
    args
  };
  return object;
}
