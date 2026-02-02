let globalHandler: ((message: string) => void) | null = null;

export function setGlobalApiErrorHandler(
  handler: ((message: string) => void) | null,
): void {
  globalHandler = handler;
}

export function getGlobalApiErrorHandler(): ((message: string) => void) | null {
  return globalHandler;
}
