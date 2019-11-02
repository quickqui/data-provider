export declare class NotCovered extends Error {
    status: number;
    message: string;
    constructor(me: string);
}
export declare function setLogEnabled(enabled: boolean): void;
export declare type DataProviderParams = {
    [key: string]: any;
};
export declare type DataProvider = (fetchType: string, resource: string, params: DataProviderParams) => Promise<any>;
export declare function chain(a: DataProvider | undefined, b: DataProvider | undefined): DataProvider;
export declare function forResourceAndFetchTypeOneParam(resource: string, fetchType: string, dataProviderFunction: (DataProviderParams: any) => any): DataProvider;
export declare function forResource(resource: string | string[], dataProvider: DataProvider): DataProvider;
export declare function forResourceAndFetchType(resource: string | string[] | undefined, type: string | string[] | undefined, dataProvider: DataProvider): DataProvider;
/**
 * @deprecated 改了更明确的名字，使用{@link #withStaticData}
 * @param json
 */
export declare function fake(json: any): DataProvider;
/**
 * @deprecated 改了更明确的名字，使用{@link #withDynamicData}
 * @param jsonFun
 */
export declare function fakeForFunction(jsonFun: () => any): DataProvider;
/**
 * @deprecated 外围自行处理Promise相关问题
 * @param json
 */
export declare function wrap(json: Promise<any>): Promise<DataProvider>;
/**
 * @deprecated 外围自行处理Promise相关问题
 * @param json
 */
export declare function asyncWrap(json: Promise<any>): DataProvider;
/**
 * @description 包装静态数据
 * @param data 初始化数据
 */
export declare function withStaticData(data: any): DataProvider;
/**
 * @description 每次调用都会重新加载数据
 * @param data 填充数据时调用的函数
 */
export declare function withDynamicData(data: any): DataProvider;
