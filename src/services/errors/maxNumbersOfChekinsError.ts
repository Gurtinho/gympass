export class MaxNumbersOfCheckinsError extends Error {
  constructor() {
    super("Max numbers of checkins reached.");
  }
}