import { assert } from "@std/assert";
import { HTTPException } from "hono/http-exception";
import { ContentfulStatusCode } from "hono/utils/http-status";

export function unwrap<T>(value: T, msg: string): NonNullable<T> {
  assert(value != null, msg);
  return value;
}

export interface HTTPAssertOptions {
  code: ContentfulStatusCode;
  message: string;
}

export function httpUnwrap<T>(
  value: T,
  options: HTTPAssertOptions,
): NonNullable<T> {
  httpAssert(value, options);
  return value;
}

export function httpAssert(
  value: unknown,
  { code, message }: HTTPAssertOptions,
): asserts value {
  if (value == null) throw new HTTPException(code, { message });
}
