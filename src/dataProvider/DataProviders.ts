import fakeDataProvider from "./fake-data";
import _ from "lodash";
import {
  GetListResult,
  GetManyReferenceResult,
  UpdateManyResult,
  GetOneResult,
  GetManyResult,
  UpdateResult,
  DeleteManyResult,
  DeleteResult,
} from "./types";
import {
  GetOneParams,
  GetListParams,
  GetManyParams,
  GetManyReferenceParams,
  CreateParams,
  UpdateParams,
  DeleteParams,
  UpdateManyParams,
  DeleteManyParams,
} from "./types";
import { loggerResponse, logger } from "./logger";
import {
  DELETE_MANY,
  CREATE,
  UPDATE_MANY,
  UPDATE,
  DELETE,
} from "./dataFetchActions";

function log(type, resource, params, response) {
  logger(
    `type - ${type} resource - ${resource} params - ${JSON.stringify(params)}`
  );

  loggerResponse(`response - ${JSON.stringify(response)}`);
}

export class NotCovered extends Error {
  status = 700;
  message = "NotCovered";
  constructor(me: string) {
    super();
    this.message = "NotCovered - " + me;
  }
}

export type DataProviderParams<T> =
  | GetOneParams
  | GetListParams
  | GetManyParams
  | GetManyReferenceParams
  | UpdateParams<T>
  | DeleteParams
  | UpdateManyParams<T>
  | CreateParams<T>
  | DeleteManyParams;
export type DataProviderResult<T> =
  | GetOneResult<T>
  | GetManyResult<T>
  | GetListResult<T>
  | GetManyReferenceResult<T>
  | UpdateManyParams<T>
  | UpdateResult<T>
  | DeleteManyResult
  | DeleteResult<T>
  | UpdateManyResult;

//NOTE 类型参数暂不传播到dataprovider定义。
export type DataProvider = (
  fetchType: string,
  resource: string,
  params: DataProviderParams<any>
) => Promise<DataProviderResult<any>>;

export function chain(
  a: DataProvider | undefined,
  b: DataProvider | undefined
): DataProvider {
  if (!a && !b) throw new Error("both undefined");
  if (!a) return b!;
  if (!b) return a;
  return async (
    fetchType: string,
    resource: string,
    params: DataProviderParams<any>
  ) => {
    try {
      const rea = await a(fetchType, resource, params);
      log(fetchType, resource, params, rea);
      return rea;
    } catch (e) {
      if (e.status === 700) {
        const reb = await b(fetchType, resource, params);
        log(fetchType, resource, params, reb);
        return reb;
      } else {
        console.error(e);
        throw e;
      }
    }
  };
}

export function forResourceAndFetchTypeOneParam<T>(
  resource: string,
  fetchType: string,
  //fixme bug， 如果传入了一个async function， 它返回的是个Promise<DataProvider>， 而不是Promise<DataProviderResult>， 前端没有type checking？
  dataProviderFunction: (
    p: DataProviderParams<T>
  ) => Promise<DataProviderResult<T>>
): DataProvider {
  return forResourceAndFetchType(
    resource,
    fetchType,
    (_: string, re: string, params: DataProviderParams<T>) => {
      return dataProviderFunction(params);
    }
  );
}

export function forResource(
  resource: string | string[],
  dataProvider: DataProvider
): DataProvider {
  return forResourceAndFetchType(resource, undefined, dataProvider);
}
export function forResourceAndFetchType<T>(
  resource: string | string[] | undefined,
  type: string | string[] | undefined,
  dataProvider: DataProvider
): DataProvider {
  return (fetchType: string, re: string, params: DataProviderParams<T>) => {
    const ra: string[] = _([resource]).flatten().compact().value();
    if (ra.length > 0 && !ra.includes(re)) {
      throw new NotCovered(`resource != ${resource}`);
    }
    const types: string[] = _([type]).flatten().compact().value();
    if (types.length > 0 && !types.includes(fetchType)) {
      throw new NotCovered(`type != ${fetchType}`);
    }
    try {
      return dataProvider(fetchType, re, params);
    } catch (e) {
      throw e;
    }
  };
}

/**
 * @deprecated 改了更明确的名字，使用{@link #withStaticData}
 * @param json
 */
export function fake(json: any): DataProvider {
  if (_.isFunction(json.then)) {
    throw new Error("do not pass a promise in.");
  }
  return fakeDataProvider(json);
}
/**
 * @deprecated 改了更明确的名字，使用{@link #withDynamicData}
 * @param jsonFun
 */
export function fakeForFunction<T>(jsonFun: () => any): DataProvider {
  return async (
    type: string,
    resource: string,
    params: DataProviderParams<T>
  ) => {
    const data = jsonFun();
    if (_.isFunction(data.then)) {
      throw new Error("do not pass a promise in.");
    }
    return fake(data)(type, resource, params);
  };
}
/**
 * @deprecated 外围自行处理Promise相关问题
 * @param json
 */
export function wrap(json: Promise<any>): Promise<DataProvider> {
  return json.then((_) => fake(_));
}
/**
 * @deprecated 外围自行处理Promise相关问题
 * @param json
 */
export function asyncWrap<T>(json: Promise<any>): DataProvider {
  return async (
    type: string,
    resource: string,
    params: DataProviderParams<T>
  ) => {
    const data = await json;
    return fake(data)(type, resource, params);
  };
}
/**
 * @description 包装静态数据
 * @param data 初始化数据
 */
export function withStaticData(data: any): DataProvider {
  if (_.isFunction(data)) {
    return withStaticData(data());
  } else {
    return fake(data);
  }
}
/**
 * @description 每次调用都会重新加载数据
 * @param data 填充数据时调用的函数
 * @param writeCallback 当fetch type是写操作时，调用，以便数据源有机会更新。
 */
export function withDynamicData<T>(
  dataFunction: Function,
  writeCallback?: Function
): DataProvider {
  if (_.isFunction(dataFunction)) {
    return (type: string, resource: string, params: DataProviderParams<T>) => {
      const d = dataFunction();
      if (isPromise(d)) {
        throw new Error("do not pass a promise in.");
      }
      const re = fake(d)(type, resource, params);
      //TODO callback 传入的参数是原来的值，不是变化后的值？
      if ([UPDATE, CREATE, DELETE, DELETE_MANY, UPDATE_MANY].includes(type))
        writeCallback?.(d);
      return re;
    };
  }
  throw new Error("not implemented, only data function implemented");
}
function isPromise(a: any) {
  if (!a) return false;
  return _.isFunction(a.then);
}
