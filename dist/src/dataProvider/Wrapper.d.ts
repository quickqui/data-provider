import { DataProvider } from './DataProviders';
declare class DataProviderWrap implements DataProviderWrap {
    private _dp;
    constructor(dataProvider: DataProvider);
    value(): DataProvider;
    chain(dp: DataProvider | DataProviderWrap): DataProviderWrap;
    forResourceAndFetchType(resource: string | string[] | undefined, type: string | string[] | undefined): DataProviderWrap;
}
declare global {
    interface Object {
        staticWrapToDataProvider(): DataProviderWrap;
    }
}
export declare function withDynamicData(fun: () => any): DataProviderWrap;
export declare function w(dataProvider?: DataProvider): DataProviderWrap;
export {};
