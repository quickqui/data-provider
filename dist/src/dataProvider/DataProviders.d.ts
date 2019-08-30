export declare type DataProviderParams = {
    [key: string]: any;
};
export declare type DataProvider = (fetchType: string, resource: string, params: DataProviderParams) => Promise<any>;
export declare function chain(a: DataProvider, b: DataProvider): DataProvider;
export declare function forResource(resource: string | string[], dataProvider: DataProvider): DataProvider;
export declare function fake(json: any): DataProvider;
export declare function wrap(json: Promise<any>): Promise<DataProvider>;
export declare function asyncWrap(json: Promise<any>): DataProvider;
