import low from "lowdb";
import { AdapterSync } from "lowdb";
import Memory from "lowdb/adapters/Memory";
import * as lodashId from "lodash-id";
import _ from "lodash";

export class LowWrapper {
  db: low.LowdbSync<any>;
  constructor(initData: object = {}, adapter?: AdapterSync) {
    const a = adapter ?? new Memory("");
    this.db = low(a);
    this.db.read();
    // console.log("get state", this.db.getState());
    // console.log("initData", initData);
    if (_.isEmpty(this.db.getState())) this.db.setState(initData).write();
    // console.log("get state", this.db.getState());

    this.db._.mixin(lodashId);
  }
  getDataset() {
    return this.db.getState();
  }
}
