import { GET_LIST } from "./dataFetchActions";
import {
  chain as c, DataProvider,



  DataProviderParams,


  DataProviderResult,
  fake, forResourceAndFetchType as raf, NotCovered, withDynamicData as wdd, withStaticData as wsd
} from "./DataProviders";

class DataProviderWrap implements DataProviderWrap {
  private _dp: DataProvider;
  constructor(dataProvider: DataProvider) {
    this._dp = dataProvider;
  }
  value(): DataProvider {
    return this._dp;
  }
  chain(dp: DataProvider | DataProviderWrap): DataProviderWrap {
    if (dp instanceof DataProviderWrap) {
      return new DataProviderWrap(c(this._dp, dp.value()));
    }
    return new DataProviderWrap(c(this._dp, dp));
  }
  forResourceAndFetchType(
    resource: string | string[] | undefined,
    type: string | string[] | undefined
  ) {
    return new DataProviderWrap(raf(resource, type, this._dp));
  }
}
export const emptyDataProvider: DataProvider = (
  type: string,
  resource: string,
  param: DataProviderParams<unknown>
) => {
  throw new NotCovered("from emptyDataProvider");
};

export function withDynamicData(
  fun: () => any,
  writeCallback?: Function
): DataProviderWrap {
  return new DataProviderWrap(wdd(fun, writeCallback));
}
export function withStaticData(data: any): DataProviderWrap {
  return new DataProviderWrap(wsd(data));
}
export function w(
  dataProvider: DataProvider = emptyDataProvider
): DataProviderWrap {
  return new DataProviderWrap(dataProvider);
}
//TODO 似乎相当简单粗暴啊。
export function localSFP(raw: DataProvider): DataProvider {
  return (
    fetchType: string,
    resource: string,
    params: DataProviderParams<any>
  ): Promise<DataProviderResult<any>> => {
    if (fetchType !== GET_LIST) {
      throw new Error("localSFP is only for GET_LIST");
    }
    const data = raw(fetchType, resource, params);
    return data.then((result) => {
      return fake({ [resource]: result.data })(fetchType, resource, params);
    });
  };
}
