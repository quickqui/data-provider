import { DataProvider, chain as c, withStaticData as wsd, withDynamicData as wdd, DataProviderParams, NotCovered, forResourceAndFetchType as raf } from './DataProviders';
import _ from 'lodash';

class DataProviderWrap implements DataProviderWrap {
    private _dp: DataProvider
    constructor(dataProvider: DataProvider) {
        this._dp = dataProvider
    }
    value(): DataProvider {
        return this._dp
    }
    chain(dp: DataProvider | DataProviderWrap): DataProviderWrap {
        if (dp instanceof DataProviderWrap) {
            return new DataProviderWrap(c(this._dp, dp.value()))
        }
        return new DataProviderWrap(c(this._dp, dp))
    }
    forResourceAndFetchType(resource: string | string[] | undefined, type: string | string[] | undefined) {
        return new DataProviderWrap(raf(resource, type, this._dp))
    }
}
const emptyDataProvider: DataProvider = (type: string, resource: string, param: DataProviderParams) => {
    throw new NotCovered('from emptyDataProvider')
}



export function withDynamicData(fun: () => any): DataProviderWrap {
    return new DataProviderWrap(wdd(fun))
}
export function withStaticData(data:any):DataProviderWrap{
    return new DataProviderWrap(wsd(data))
}
export function w(dataProvider: DataProvider = emptyDataProvider): DataProviderWrap {
    return new DataProviderWrap(dataProvider)
}
