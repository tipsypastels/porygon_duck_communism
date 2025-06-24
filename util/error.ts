export function getErrorMessage(error: unknown) {
  switch (true) {
    case typeof error === "string": {
      return error;
    }
    case error instanceof Error: {
      return error.message;
    }
    case error != null && typeof error === "object" && "message" in error &&
      typeof error.message === "string": {
      error.message;
    }
  }
}
