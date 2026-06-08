const getErrorMessage = (errorValue: unknown): string =>
  errorValue instanceof Error ? errorValue.message : String(errorValue);

export { getErrorMessage };
