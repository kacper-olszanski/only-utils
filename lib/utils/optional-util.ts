import { isDefined } from '.';
import { Optional, TOrUndefined } from '../types';
import {
  EmptyFunction,
  SimpleFunction,
} from '../types/helpers/function-helpers';

/**
 * Represents an optional value that may or may not be present.
 * @template T - The type of the optional value.
 */
export type OptionalValue<T> = {
  /**
   * Retrieves the value if present, otherwise returns undefined.
   * @returns The optional value or undefined.
   */
  get: () => TOrUndefined<T>;

  /**
   * Returns this optional value if present, otherwise returns the other optional value.
   * @template R - The type of the other optional value.
   * @param other - The other optional value.
   * @returns This optional value or the other optional value.
   */
  or: <R>(other: OptionalValue<R>) => OptionalValue<T> | OptionalValue<R>;

  /**
   * Checks if the optional value is present.
   * @returns True if the optional value is present, false otherwise.
   */
  isPresent: () => boolean;

  /**
   * Returns the value if present, otherwise returns the default value.
   * @param defaultValue - The default value to return if the optional value is not present.
   * @returns The value if present, otherwise the default value.
   */
  orElse: (defaultValue: T) => T;

  /**
   * Returns the value if present, otherwise throws the specified error.
   * @param error - The error to throw if the optional value is not present.
   * @returns The value if present.
   * @throws The specified error if the optional value is not present.
   */
  orElseThrow: (error: Error) => T;

  /**
   * Executes the specified callback function if the optional value is present.
   * @param callback - The callback function to execute.
   */
  ifPresent: (callback: SimpleFunction<T>) => void;

  /**
   * Executes the specified callback function if the optional value is present, otherwise executes the empty action.
   * @param callback - The callback function to execute if the optional value is present.
   * @param emptyAction - The action to execute if the optional value is not present.
   */
  ifPresentOrElse: (
    callback: SimpleFunction<T>,
    emptyAction: EmptyFunction,
  ) => void;

  /**
   * Filters the optional value based on the specified predicate function.
   * @param predicate - The predicate function to filter the optional value.
   * @returns A new optional value that contains the filtered value if present, otherwise an empty optional value.
   */
  filter: (predicate: SimpleFunction<T, boolean>) => OptionalValue<T>;

  /**
   * Maps the optional value to a new value using the specified mapper function. It is usefull for nested optionals.
   * @template R - The type of the new value.
   * @param mapper - The mapper function to transform the optional value.
   * @returns A new optional value that contains the mapped value if present, otherwise an empty optional value.
   */
  map: <R>(mapper: SimpleFunction<T, R>) => OptionalValue<R>;

  /**
   * Maps the optional value to a new optional using the specified mapper function.
   * @template R - The type of the new value.
   * @param mapper - The mapper function to transform the optional value.
   * @returns A new optional value that contains the mapped value if present, otherwise an empty optional value.
   */
  flatMap: <R>(mapper: SimpleFunction<T, OptionalValue<R>>) => OptionalValue<R>;
};

/**
 * Represents an empty optional value.
 * @returns {OptionalValue<unknown>} - An empty optional value.
 */
const emptyOptional = optionalFunc<unknown>(void 0);

/**
 * This is similar like the Optional class in Java.
 * Creates an optional value wrapper around the provided value.
 * An optional value can either contain a defined value or be empty.
 *
 * @typeparam T - The type of the value being wrapped.
 * @param value - The value to be wrapped.
 * @returns An object with various utility methods to work with the optional value.
 */
function optionalFunc<T>(value: Optional<T>): OptionalValue<T> {
  const defined = isDefined(value);

  return {
    get: function () {
      return defined ? value : undefined;
    },
    or: function <R>(other: OptionalValue<R>) {
      return defined ? this : other;
    },
    isPresent: () => defined,
    orElse: function (defaultValue: T) {
      return this.get() ?? defaultValue;
    },
    orElseThrow: function (error: Error) {
      if (defined) {
        return value;
      }
      throw error;
    },
    map: function <R>(mapper: SimpleFunction<T, R>): OptionalValue<R> {
      return defined
        ? optionalFunc(mapper(value))
        : (emptyOptional as OptionalValue<R>);
    },
    flatMap: function <R>(
      mapper: SimpleFunction<T, OptionalValue<R>>,
    ): OptionalValue<R> {
      return defined ? mapper(value) : (emptyOptional as OptionalValue<R>);
    },
    filter: function (predicate: SimpleFunction<T, boolean>): OptionalValue<T> {
      return defined && predicate(value)
        ? this
        : (emptyOptional as OptionalValue<T>);
    },
    ifPresent: function (callback: SimpleFunction<T>): void {
      if (defined) {
        callback(value);
      }
    },
    ifPresentOrElse: function (
      callback: SimpleFunction<T>,
      emptyAction: EmptyFunction,
    ): void {
      if (defined) {
        callback(value);
      } else {
        emptyAction();
      }
    },
  };
}

Object.defineProperty(optionalFunc, 'empty', {
  value: emptyOptional,
  configurable: false,
  writable: false,
});

export const optional = optionalFunc as typeof optionalFunc & {
  empty: typeof emptyOptional;
};
