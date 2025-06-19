import { assert } from "@std/assert";

export function unwrap<T>(value: T, msg: string): NonNullable<T> {
  assert(value != null, msg);
  return value;
}
