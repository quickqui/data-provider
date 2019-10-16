import { DataProvider } from './DataProviders';
interface Wrapper {
    value(): DataProvider;
    chain(dp: DataProvider): Wrapper;
}
declare class DataProviderWrap implements Wrapper {
    private _dp;
    constructor(dataProvider: DataProvider);
    value(): DataProvider;
    chain(dp: DataProvider): Wrapper;
    forResourceAndFetchType(resource: string | string[] | undefined, type: string | string[] | undefined): DataProviderWrap;
}
declare global {
    interface Object {
        staticWrapToDataProvider(): Wrapper;
    }
}
export declare function withDynamicData(fun: () => any): DataProviderWrap;
export declare function w(): DataProviderWrap;
export {};
