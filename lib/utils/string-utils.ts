import { isDefined } from '.';
import { Optional, TOrUndefined } from '../types';
import { Braces, Quotation } from '../types/helpers/string-helpers';

/**
 * Wraps the given value with braces.
 *
 * @param value - The value to be wrapped.
 * @param start - The starting brace character. Default is '{'.
 * @param end - The ending brace character. Default is '}'.
 * @returns The wrapped value.
 */
export const braceYourself = (
  value: string,
  [start, end]: Braces = ['{', '}'],
): string => `${start}${value}${end}`;

/**
 * Adds quotation marks around a string value.
 *
 * @param value - The string value to be quoted.
 * @param quotation - The quotation mark to be used (default: ").
 * @returns The quoted string.
 */
export const quote = (value: string, quotation: Quotation = '"'): string =>
  braceYourself(value, [quotation, quotation]);

/**
 * Converts an empty string to undefined.
 * @param value - The string value to convert.
 * @returns The converted string value or undefined if the input is an empty string.
 */
export const emptyStringToUndefined = (
  value: Optional<string>,
): TOrUndefined<string> => {
  if (!isDefined(value)) {
    return undefined;
  }

  return value.trim().length === 0 ? undefined : value.trim();
};

/**
 * Converts an optional string value to an empty string if it is undefined.
 * @param value - The optional string value to convert.
 * @returns The converted string value, or an empty string if the value is undefined.
 */
export const undefinedToEmptyString = (value: Optional<string>) => value ?? '';
