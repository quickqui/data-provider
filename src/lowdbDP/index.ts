import { LowWrapper } from "./lowWrapper";
import dpFromLowDB from "./lowdbDP";
import LocalStorage from "lowdb/adapters/LocalStorage";
import Memory from "lowdb/adapters/Memory";
import { SessionStorage } from "./SessionStorageAdapter";
import FileSync from "lowdb/adapters/FileSync";

export function localStorageDp(source: string, initData: object = {}) {
  return dpFromLowDB(
    new LowWrapper(initData, new LocalStorage(source, initData))
  );
}
export function sessionStorageDp(source: string, initData: object = {}) {
  return dpFromLowDB(
    new LowWrapper(initData, new SessionStorage(source, initData))
  );
}

export function memoryDp(initData: object = {}) {
  return dpFromLowDB(new LowWrapper(initData, new Memory("", initData)));
}

//FIXME: 在浏览器环境下FileSync adaptor有问题，
export function fileDp(source: string, initData: object = {}) {
  return dpFromLowDB(new LowWrapper(initData, new FileSync(source, initData)));
}
