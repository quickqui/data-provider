import FileSync from "lowdb/adapters/FileSync";
import dpFromLowDB from "./lowdbDP";
import { LowWrapper } from "./lowWrapper";

//FIXME: 在浏览器环境下FileSync adaptor有问题，
export function fileDp(source: string, initData: object = {}) {
  return dpFromLowDB(new LowWrapper(initData, new FileSync(source)));
}
export function fileAdapter(source: string) {
  return new FileSync(source, {});
}
