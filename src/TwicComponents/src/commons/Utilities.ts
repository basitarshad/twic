import { anyPass, isEmpty, isNil } from 'ramda';

// returns true if the param is empty or nil
export const isEmptyOrNil = anyPass([isEmpty, isNil]);
