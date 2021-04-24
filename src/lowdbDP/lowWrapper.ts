import low from "lowdb";
import { AdapterSync } from "lowdb";
import Memory from "lowdb/adapters/Memory";
import * as lodashId from "lodash-id";

export class LowWrapper {
  db: low.LowdbSync<any>;
  constructor(initData: object = {}, adapter?: AdapterSync) {
    const a = adapter ?? new Memory("");
    this.db = low(a);
    this.db.setState(initData).write();
    this.db._.mixin(lodashId);
  }
  getDataset() {
    return this.db.getState();
  }
}
