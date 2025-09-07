export const logger = {
  log: (...args: unknown[]): void => {
    if (import.meta.env.DEV) {
      console.log(...args);
    }
  },
  error: (...args: unknown[]): void => {
    if (import.meta.env.DEV) {
      console.error(...args);
    }
  },
};

export default logger;
