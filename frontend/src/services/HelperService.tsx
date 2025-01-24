import React from "react";

export default class HelperService {
  public static mergeArrayByKey<T extends object>(
    array1: T[],
    array2: T[],
    key: keyof T
  ) {
    const arr1Keys = array1.map((item) => item[key]);
    const arr2Keys = array2.map((item) => item[key]);
    const uniqueKeys = Array.from(new Set([...arr1Keys, ...arr2Keys]));
    const mergedArray: Array<T> = uniqueKeys.map((uniqKey) => {
      const item1 = array1.find((item) => item[key] === uniqKey)!;
      const item2 = array2.find((item) => item[key] === uniqKey)!;
      return { ...item1, ...item2 };
    });

    return mergedArray;
  }

  public static formatDateTime(date: string) {
    return new Date(date).toISOString().slice(0, -5).split("T").join(" ");
  }

  public static formatDateTimeWithBreak(date: string) {
    return HelperService.formatDateTime(date)
      .split(" ")
      .map((d, i) => (
        <React.Fragment key={i}>
          {d}
          <br />
        </React.Fragment>
      ));
  }
}

// eslint-disable-next-line
// @ts-ignore
window.h = HelperService;
