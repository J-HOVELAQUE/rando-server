export interface OutcomeFailure {
  outcome: "FAILURE";
  /**
   * It's a specific error code relative to the error.
   */
  errorCode: string;
  /**
   * The explanation why the error happened.
   */
  detail?: string;
  /**
   * You can put anything usefull to understand the error.
   * You should not let it to any and type it in your implementation.
   */
}

export interface OutcomeSuccess<d> {
  outcome: "SUCCESS";
  /**
   * It's the result of the operation.
   * It can be anything you wants.
   * You should not let it to any and type it in your implementation.
   */
  data: d;
}
