import { CreateParams, CreateResult } from "../dataProvider/types";
import _ from "lodash";
import { DataProvider } from "../dataProvider/DataProviders";
import { CREATE } from "../dataProvider/dataFetchActions";

export function request<T>(re: T): CreateParams<T> {
  return { data: re as Exclude<T, "id"> };
}
export function response<R>(creatResult: CreateResult<R>): R {
  return creatResult.data;
}
export function command<T, R>(
  delegate: DataProvider,
  name: string,
  params: T
): Promise<R> {
  return delegate(CREATE, name, request(params)).then(re =>
    response(re as CreateResult<R>)
  );
}
