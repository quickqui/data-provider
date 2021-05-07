import { LowWrapper } from "./lowWrapper";
import dpFromLowDB from "./lowdbDP";
import LocalStorage from "lowdb/adapters/LocalStorage";
import Memory from "lowdb/adapters/Memory";
import { SessionStorage } from "./SessionStorageAdapter";
import FileSync from "lowdb/adapters/FileSync";
export * from './lowWrapper'

export function localStorageDp(source: string, initData: object = {}) {
  return dpFromLowDB(
    new LowWrapper(initData, new LocalStorage(source))
  );
}
export function sessionStorageDp(source: string, initData: object = {}) {
  return dpFromLowDB(
    new LowWrapper(initData, new SessionStorage(source))
  );
}

export function memoryDp(initData: object = {}) {
  return dpFromLowDB(new LowWrapper(initData, new Memory("")));
}

//FIXME: 在浏览器环境下FileSync adaptor有问题，
export function fileDp(source: string, initData: object = {}) {
  return dpFromLowDB(new LowWrapper(initData, new FileSync(source)));
}
export function fileAdapter(source: string) {
  return new FileSync(source, {});
}