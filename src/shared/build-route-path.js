export const buildRoutePath = (path) => {
  const routeParametersRegex = /:([a-zA-Z]+)/g;
  const paramsWithParams = path.replaceAll(
    routeParametersRegex,
    '(?<$1>[a-z0-9-_]+)'
  );

  const pathRegex = new RegExp(`^${paramsWithParams}(?<query>\\?(.*))?$`);
  // console.log('routeParametersRegex', routeParametersRegex);
  // console.log('paramsWithParams', paramsWithParams);
  // console.log('pathRegex', pathRegex);

  return pathRegex;
};
