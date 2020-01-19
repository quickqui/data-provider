import { GetListParams, GetListResult } from "../dataProvider/types";
import { DataProvider } from "../dataProvider/DataProviders";
import { GET_LIST } from "../dataProvider/dataFetchActions";
import jsonAggregate from "json-aggregate";

export type AggregateParams = GetListParams & {
  aggregate: any;
};

export function aggregate<T, R>(
  delegate: DataProvider,
  resource: string,
  params: AggregateParams
): Promise<GetListResult<R>> {
  const list = delegate(GET_LIST, resource, params);
  return list.then(li => {
    const listData = (li as GetListResult<T>).data;
    const collection = jsonAggregate.create(listData);
    const aggregated = collection.group((params as AggregateParams).aggregate);
    return {
      data: aggregated
    } as GetListResult<any>;
  });
}
