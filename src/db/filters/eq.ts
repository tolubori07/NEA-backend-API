type GenericObject = { [key: string]: any };

export const eq = (key: string, value: any): (element: GenericObject) => boolean => {
  return (element: GenericObject) => element[key] === value;
}
