class CustomError extends Error {
  /**
   * @param {string} errorHeading
   * @param {string=} originalMessage
   */
  constructor(errorHeading, originalMessage) {
    super(errorHeading + (originalMessage ? ': ' + originalMessage : ''));
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.originalMessage = originalMessage;
  }
}

export class OperationFailed extends CustomError {
  /**
   * @param {string=} originalMessage
   */
  constructor(originalMessage) {
    super('Operation Failed', originalMessage);
  }
}

export class InvalidInput extends CustomError {
  /**
   * @param {string=} originalMessage
   */
  constructor(originalMessage) {
    super('Invalid Input', originalMessage);
  }
}
