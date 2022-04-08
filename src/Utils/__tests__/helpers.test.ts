import {
  capitalizeFirstLetter,
  capitalizeWordAndRemoveUnderScore,
  createAddressString,
  createFormData,
  findCountryCurrencyCode,
  findCountryName,
  generateUUID,
  isAnyPropertyEmptyInObject,
  isEmptyOrNil,
  renameKeysInList,
  renameKeysInObject,
  replacePropInList,
  sortListByKey,
  validateZipcode,
} from "../helpers";

test("Capitalize first character of the string or word", () => {
  expect(capitalizeFirstLetter("twic")).toBe("Twic");
});

test("Capitalize word and remove underscore", () => {
  expect(capitalizeWordAndRemoveUnderScore("twic_wellness")).toBe("Twic Wellness");
});

describe("EmtyOrNull function use-cases", () => {
  test("if string is empty", () => {
    expect(isEmptyOrNil("")).toBe(true);
  });
  test("if string is not empty", () => {
    expect(isEmptyOrNil("Twic Wellness")).toBe(false);
  });
  test("if object is empty", () => {
    expect(isEmptyOrNil({})).toBe(true);
  });
  test("if string is not empty", () => {
    expect(isEmptyOrNil({ name: "Twic Wellness" })).toBe(false);
  });
  test("if array is empty", () => {
    expect(isEmptyOrNil([])).toBe(true);
  });
  test("if array is not empty", () => {
    expect(isEmptyOrNil([{ name: "Twic Wellness" }])).toBe(false);
  });
  test("if null is nill", () => {
    expect(isEmptyOrNil(null)).toBe(true);
  });
  test("if undefined is not nil", () => {
    expect(isEmptyOrNil(undefined)).toBe(true);
  });
});

test("Find country name from country shorthand code", () => {
  expect(findCountryName("us")).toBe("United States");
});

test("Find currency code from country shorthand code", () => {
  expect(findCountryCurrencyCode("us")).toBe("$");
});

describe("Create address string from object of values", () => {
  test("if address string is created with all the given values", () => {
    expect(
      createAddressString({
        line1: "256 boulevard",
        line2: "jumla",
        city: "new york",
        state: "new york",
        postal_code: "12345",
        country: "united states",
      }),
    ).toBe("256 boulevard, jumla, new york, new york, 12345, united states");
  });

  test("if address string is created with some null values", () => {
    expect(
      createAddressString({
        line1: "256 boulevard",
        line2: null,
        city: null,
        state: "new york",
        postal_code: "12345",
        country: "united states",
      }),
    ).toBe("256 boulevard, new york, 12345, united states");
  });
});

describe("Validate zip code against country code", () => {
  test("If correct zip code is given", () => {
    expect(validateZipcode("us", 12345)).toBe(true);
  });

  test("If wrong zip code is given", () => {
    expect(validateZipcode("us", 1234)).toBe(false);
  });
});

describe("Sort array both ascending and descending", () => {
  const unsortedArray = [
    {
      id: 5,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
  ];

  test("Ascending order sort", () => {
    expect(sortListByKey("asc", "id")(unsortedArray)).toEqual([{ id: 2 }, { id: 3 }, { id: 5 }]);
  });

  test("Descending order sort", () => {
    expect(sortListByKey("desc", "id")(unsortedArray)).toEqual([{ id: 5 }, { id: 3 }, { id: 2 }]);
  });
});

describe("Verify empty properties in object", () => {
  const dummyObjWithEmptyEntry = {
    id: 5,
    name: "",
    company: "Twic",
  };

  const dummyObjWithNoEmptyEntry = {
    id: 5,
    name: "Test",
    company: "Twic",
  };

  test("If any property is empty in object with an empty entry if no entry is ommited from object ", () => {
    expect(isAnyPropertyEmptyInObject(dummyObjWithEmptyEntry, [])).toEqual(true);
  });

  test("If any property is empty in object with zero empty entry if no entry is ommited from object ", () => {
    expect(isAnyPropertyEmptyInObject(dummyObjWithNoEmptyEntry, [])).toEqual(false);
  });

  test("If any property is empty in object with an empty entry if empty entry is ommited from object ", () => {
    expect(isAnyPropertyEmptyInObject(dummyObjWithEmptyEntry, ["name"])).toEqual(false);
  });

  test("If any property is empty in object with zero empty entry if filled entry is ommited from object ", () => {
    expect(isAnyPropertyEmptyInObject(dummyObjWithNoEmptyEntry, ["id"])).toEqual(false);
  });
});

describe("Change key name in object", () => {
  const dummyObj = {
    id: 5,
    name: "",
    company: "Twic",
  };

  test("If multiple keys names can be changed", () => {
    expect(renameKeysInObject({ company: "companyName", name: "fullName" })(dummyObj)).toEqual({ companyName: "Twic", id: 5, fullName: "" });
  });

  test("If single key name can be changed", () => {
    expect(renameKeysInObject({ company: "companyName" })(dummyObj)).toEqual({ companyName: "Twic", id: 5, name: "" });
  });
});

describe("Rename keys of list of objects", () => {
  const dummyObj = [
    {
      id: 5,
      name: "",
      company: "Twic",
    },
    {
      id: 6,
      name: "Test",
      company: "Twic Wellness",
    },
  ];

  test("If single key name can be changed", () => {
    expect(renameKeysInList({ company: "companyName" }, dummyObj)).toEqual([
      { companyName: "Twic", id: 5, name: "" },
      { companyName: "Twic Wellness", id: 6, name: "Test" },
    ]);
  });
});

describe("Replace property in list", () => {
  const dummyObj = [
    {
      id: 5,
      name: "",
      company: "Twic",
    },
    {
      id: 6,
      name: "Test",
      company: "Twic Wellness",
    },
  ];

  test("Compare and replace list on the basis of filtered data", () => {
    expect(replacePropInList({ key: "id", comparedValue: 5 }, { key: "name", valueToReplace: "Updated test" }, dummyObj)).toEqual([
      { company: "Twic", id: 5, name: "Updated test" },
      { company: "Twic Wellness", id: 6, name: "Test" },
    ]);
  });
});
