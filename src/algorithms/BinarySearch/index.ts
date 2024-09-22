import type { GenericObject } from "../../types";

export const binarySearch = (list: GenericObject[], field: string, target: any) => {
  let left: number = 0;
  let right: number = list.length - 1;


  while (left <= right) {
    const mid: number = Math.floor((left + right) / 2);
    const midValue = list[mid][field];
    // Handle undefined or null values, just in case
    if (midValue === undefined || midValue === null) {
      return -1;
    }

    // If both midValue and target are strings, compare them in a case-insensitive way
    if (typeof midValue === "string" && typeof target === "string") {
      if (midValue.toLowerCase() === target.toLowerCase()) {
        return mid;
      } else if (midValue.toLowerCase() < target.toLowerCase()) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    // If both midValue and target are numbers, or primitives, compare directly
    else if (midValue === target) {
      return mid;
    } else if (midValue < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  // If not found, return -1
  return -1;
};
