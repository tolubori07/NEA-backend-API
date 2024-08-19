export const quickSort = (list: any[],by:string): any[] => {
  if (list.length <= 1) {
    return list;
  }

  const lowerBound: number = 0;
  const upperBound: number = list.length - 1;
  const pivotIndex = Math.floor((lowerBound + upperBound) / 2);
  const pivot = list[pivotIndex];

  const left: any[] = [];
  const right: any[] = [];

  for (let i = 0; i < list.length; i++) {
    if (i !== pivotIndex) {
      if (list[i][by] < pivot[by]) {
        left.push(list[i]);
      } else {
        right.push(list[i]);
      }
    }
  }

  return [...quickSort(left,by), pivot, ...quickSort(right,by)];
};


