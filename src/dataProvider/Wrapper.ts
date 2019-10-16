import { DataProvider, chain as c, withStaticData, withDynamicData as wdd, DataProviderParams, NotCovered, forResourceAndFetchType as raf} from './DataProviders';
interface Wrapper {
    value(): DataProvider
    chain(dp: DataProvider): Wrapper
}
class DataProviderWrap implements Wrapper {
    private _dp: DataProvider
    constructor(dataProvider: DataProvider) {
        this._dp = dataProvider
    }
    value(): DataProvider {
        return this._dp
    }
    chain(dp: DataProvider): Wrapper {
        return new DataProviderWrap(c(this._dp, dp))
    }
    forResourceAndFetchType(resource: string | string[] | undefined, type: string | string[] | undefined){
        return new DataProviderWrap(raf(resource,type,this._dp))
    }
}
const emptyDataProvider: DataProvider = (type: string, resource: string, param: DataProviderParams) => {
    throw new NotCovered('from emptyDataProvider')
}

declare global {
    interface Object {
        staticWrapToDataProvider(): Wrapper
    }
}
Object.prototype.staticWrapToDataProvider = function () {
    return new DataProviderWrap(withStaticData(this))
}

export function withDynamicData(fun: () => any): DataProviderWrap {
    return new DataProviderWrap(wdd(fun))
}

export function w(): DataProviderWrap {
    return new DataProviderWrap(emptyDataProvider)
}