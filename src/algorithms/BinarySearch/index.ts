import type { GenericObject } from "../../types";
import { quickSort } from "../Quicksort";

export const binarySearch = (list: GenericObject[], field: string, target: any): number => {
  let left: number = 0;
  let right: number = list.length - 1;
  list = quickSort(list,field)

  while (left <= right) {
    const mid: number = Math.floor((left + right) / 2);
    const midValue = list[mid][field];
    // Use direct comparison to check if the midValue is the target
    if (midValue === target) {
      return mid;
    } else if (midValue < target) { 
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1; // If not found, return -1
};
