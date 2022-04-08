import STATUSES from "Constants/Statuses";
import { differenceInDays, format, getUnixTime } from "date-fns";
import { getParamByISO } from "iso-country-currency";
import postalCodes from "postal-codes-js";
import { addIndex, any, anyPass, ascend, assoc, curry, descend, filter, forEach, isEmpty, isNil, keys, map, omit, pathOr, pipe, prop, propEq, reduce, sort, values, when, without } from "ramda";
import { useEffect, useRef, useState } from "react";
import { Dimensions } from "react-native";
import { isCommuterAccount, sortUserPretaxAccounts } from "Screens/Accounts/PreTaxAccountDetailScreen/pretax.helpers";
import { Colors, Images } from "Themes";
import { PretaxAccountsType } from "types";

const { width, height } = Dimensions.get("window");

export const capitalizeWordAndRemoveUnderScore = (string) => {
  let str = string.split("_");
  for (let i = 0, x = str.length; i < x; i++) {
    str[i] = str[i][0].toUpperCase() + str[i].substr(1);
  }
  return str.join(" ");
};

export const toUnix = (value) => {
  return getUnixTime(new Date(value));
};

export const ignoreCaseSensitivityAndReplaceWord = (string, wordToReplace, replaceWith) => {
  const regEx = new RegExp(wordToReplace, "ig");
  return string.replace(regEx, replaceWith);
};

export const dateToLLFormat = (value) => {
  return format(new Date(value), "MMM dd, yyyy");
};

// returns true if the param is empty or nil
export const isEmptyOrNil = anyPass([isEmpty, isNil]);
export const indexedMap = addIndex(map);
export const mapWithoutEmpty = curry((mapFunction: Function, list: Array<any> | []) => {
  //@ts-ignore
  return pipe(
    //@ts-ignore
    map(mapFunction),
    without(["", {}, null, undefined]),
    //@ts-ignore
  )(list) as Array<any>;
});

export const asyncMap = (asyncMapFunction: Function, list: Array<any>) => {
  //@ts-ignore
  return Promise.all(map(asyncMapFunction, list));
};

/**
 * async forEach iterator
 *
 * @param {List} array
 * @param {Async/Await} callback
 */
export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const replacePropInList = curry((keyToCompare, keyToReplace, list) => {
  const { key, comparedValue } = keyToCompare;
  const { key: replacedKey, valueToReplace } = keyToReplace;

  return map(when(propEq(key, comparedValue), assoc(replacedKey, valueToReplace)), list);
});

export const renameKeysInList = (keyMap, list) => {
  if (isEmptyOrNil(keyMap) || isEmptyOrNil(list)) return list;

  const renameKeys = curry((keysMap, obj) => reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj)));
  return map(renameKeys(keyMap), list);
};

export const createFormData = (props: { data: any; fieldNameToMap?: string; fieldNameForApi?: string }) => {
  const { data, fieldNameToMap, fieldNameForApi } = props;
  const formData = new FormData();
  const formKeys: string[] | any = keys(data);

  forEach((key: string) => {
    if (key === fieldNameToMap) {
      for (var i = 0; i < data[key].length; i++) {
        formData.append(`${fieldNameForApi}`, data[key][i]);
      }
    } else formData.append(key, data[key]);
  }, formKeys);

  return formData;
};

export const renameKeysInObject = curry((keysMap, obj) => reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj)));

export const isAnyPropertyEmptyInObject = (obj: object, omittedKeys: Array<string> = []) => {
  return pipe(omit(omittedKeys), values, any(isEmptyOrNil))(obj);
};

export const transformArrayToPairs = (list) => {
  const data = [...list];

  data.reduce((result, value, index, array) => {
    if (index % 2 === 0) result.push(array.slice(index, index + 2));
    return result;
  }, []);

  return data;
};

export const sortListByKey = curry((sortOrder, key, list) => {
  const sortingFunction = sortOrder === "asc" ? ascend(prop(key)) : descend(prop(key));
  //@ts-ignore
  const sortedList = sort(sortingFunction, list);
  return sortedList;
});

export const getTransactionAndSubscriptionStatus = (isCancelled, status) => {
  return isCancelled
    ? {
        icon: Images.cancel,
        color: Colors.black,
        name: "Cancelled",
      }
    : {
        icon: pathOr(STATUSES.cancelled.icon, [status, "icon"], STATUSES),
        color: pathOr(STATUSES.cancelled.color, [status, "color"], STATUSES),
        name: pathOr(STATUSES.cancelled.name, [status, "name"], STATUSES),
      };
};

/**
 * Timeout injector for number of milliseconds
 *
 * @export
 * @param {Number} time
 * @returns
 */
export function injectTimeout(time) {
  return async () => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };
}

export function getUniqueListBy(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}

export const getDaysLeft = (endDate) => {
  const today = format(new Date(), "yyyy-MM-dd");
  const diff = differenceInDays(new Date(today), new Date(endDate)) - 1;
  return Math.round(diff);
};

/**
 *  uuid generator
 *
 * @returns
 */
export function generateUUID() {
  const oldStr = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";

  return `${Date.now()}-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Hook
export const usePreviousHook = (value) => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
};

// when props are updated use state is updated automatically
export const useValue = <T>(defaultValue: T) => {
  const state = useState<T>(defaultValue);
  const setValue = state[1];
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  return state;
};
export default useValue;

// Hook
const isOrientationPortrait = () => {
  const { height, width } = Dimensions.get("screen");
  return width < height;
};

export const useIsDeviceOrientationPortrait = () => {
  const [isPortrait, setIsPortrait] = useState(isOrientationPortrait());

  useEffect(() => {
    Dimensions.addEventListener("change", () => {
      setIsPortrait(isOrientationPortrait());
    });
  }, []);

  return isPortrait;
};

export const isIphoneXorAbove = () => {
  // @TODO: need to find better way around for notch phones
  let num: number = 2.5;
  if (
    //heights for iphoneX or above
    height === 780 ||
    height === 780 ||
    height === 812 ||
    height === 812 ||
    height === 844 ||
    height === 844 ||
    height === 896 ||
    height === 896 ||
    height === 926 ||
    height === 926
  ) {
    num = 3.7;
  }

  return num;
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const capitalizeFirstLetterOfEachWord = (str: string, sliceCharacter = " ") => {
  const slicedString = str.split(sliceCharacter);
  const capitalizedWords = slicedString.map((value: string) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  });
  return capitalizedWords.join(" ");
};

export const validateZipcode = (countryCode, zipCode) => {
  const isValidZipcode = postalCodes.validate(countryCode, zipCode);
  return typeof isValidZipcode === "boolean" ? true : false;
};

export const createAddressString = (address = {}, addressOrder = ["line1", "line2", "city", "state", "postal_code", "country"]) => {
  let addressString = "";

  addressOrder.forEach((key, index) => {
    addressString += !isEmptyOrNil(address[key]) ? `${address[key]}${index <= 4 ? ", " : " "}` : "";
  });

  return addressString.trim();
};

export const findCountryCurrencyCode = (countryCode: string) => getParamByISO(countryCode, "symbol");

export const findCountryName = (countryCode: string) => getParamByISO(countryCode, "countryName");

export const findCountryCurrency = (countryCode: string) => getParamByISO(countryCode, "currency");

export const formatCardNumberWithFourLettersSpacing = (number: string) => number.replace(/\d{4}(?=.)/g, "$&   ");

export const isFSAStore = (preTaxAccounts: PretaxAccountsType[]) => {
  const formattedPreTaxAccounts = formatPreTaxAccounts(preTaxAccounts);
  const isFSAStoreAccounts = formattedPreTaxAccounts.filter((item) => {
    return item.title === "FSA" || item.title === "HSA" || item.title === "LPFSA & HSA" || item.title === "LPFSA";
  });
  return { isFSAStoreEnabled: isFSAStoreAccounts.length > 0, countFSAStores: isFSAStoreAccounts.length };
};

const hidePreTaxAccounts = (account: PretaxAccountsType) => {
  return !["DCFSA", "DCA", "TRN", "Transit Benefit", "Parking Benefit"].includes(account.accountType);
};
type FormatPreTaxAccountsResponseType = {
  title: string;
  amount: number | string;
  accounts: PretaxAccountsType[];
};

const renameAndFormatPreTaxAccount = (account: PretaxAccountsType): FormatPreTaxAccountsResponseType => {
  const { accountType, amount } = account;
  if (accountType === "LFS" || accountType === "LPF" || accountType === "LPFSA") {
    return { title: "LPFSA", amount, accounts: [{ ...account, accountType: "LPFSA" }] };
  } else if (accountType === "HSA" || accountType === "WCS") {
    return { title: "HSA", amount, accounts: [{ ...account, accountType: "HSA" }] };
  }
  return { title: accountType, amount, accounts: [account] };
};

type FormatPreTaxAccountsType = (preTaxAccounts: PretaxAccountsType[]) => FormatPreTaxAccountsResponseType[];

export const formatPreTaxAccounts: FormatPreTaxAccountsType = (preTaxAccounts) => {
  const activePreTaxAccounts = sortUserPretaxAccounts(filter(hidePreTaxAccounts, preTaxAccounts));
  const renamedPreTaxAccounts: FormatPreTaxAccountsResponseType[] = map(renameAndFormatPreTaxAccount, activePreTaxAccounts);

  const fsaPreTaxAccounts = renamedPreTaxAccounts.reduce((acc: FormatPreTaxAccountsResponseType[], current) => {
    if (current.title === "LPFSA") {
      const HSAAccount = acc.filter((item) => item.title === "HSA");
      if (!isEmptyOrNil(HSAAccount)) {
        const filterdPreTaxAccounts = acc.filter((item) => item.title !== "HSA");
        return [...filterdPreTaxAccounts, { title: "LPFSA & HSA", amount: "", accounts: [...current.accounts, ...HSAAccount[0].accounts] }];
      }
    }
    if (current.title === "HSA") {
      const LFSAAccount = acc.filter((item) => item.title === "LPFSA");
      if (!isEmptyOrNil(LFSAAccount)) {
        const filterdPreTaxAccounts = acc.filter((item) => item.title !== "LPFSA");
        return [...filterdPreTaxAccounts, { title: "LPFSA & HSA", amount: "", accounts: [...LFSAAccount[0].accounts, ...current.accounts] }];
      }
    }
    return [...acc, current];
  }, []);

  return fsaPreTaxAccounts.filter((pretax) => !isCommuterAccount(pretax.title));
};

export function truncate(str: string, maxLength: number, appendStr = "") {
  if (typeof str !== "string" || str.length <= maxLength) return str;
  const result = str.slice(0, maxLength);
  return result + appendStr;
}

export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      //@ts-ignore
      func.apply(this, args);
    }, timeout);
  };
}
