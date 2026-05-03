import { initializeApp } from "firebase-admin/app";
import { setGlobalOptions } from "firebase-functions/v2";

// Single admin SDK init shared by all triggers.
initializeApp();

// Default region + concurrency for every function in this codebase.
// us-central1 is closest to most US users; bump or change per-function with
// region overrides if needed later.
setGlobalOptions({
  region: "us-central1",
  maxInstances: 10,
  // Functions should be cheap to invoke — keep memory + cpu modest.
  memory: "256MiB",
});

export { onTransactionWriteUpdateAccount } from "./account-balance";
export {
  onCategoryMonthWriteUpdateBudgetMonth,
  onTransactionWriteUpdateBudgetMonth,
} from "./budget-month";
export { recomputeHousehold } from "./recompute";
