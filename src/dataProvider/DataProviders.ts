import fakeDataProvider from './fake-data';
import _ from 'lodash';

function log(type, resource, params, response) {
    if (!logEnabled) return
    // Better logging in Chrome
    console.groupCollapsed(type, resource, JSON.stringify(params));
    console.log(response);
    console.groupEnd();

}

export class NotCovered extends Error {
    status = 700
    message = 'NotCovered'
    constructor(me: string) {
        super()
        this.message = 'NotCovered - ' + me
    }
}

let logEnabled = false
export function setLogEnabled(enabled: boolean) {
    logEnabled = enabled
}

export type DataProviderParams = { [key: string]: any }

export type DataProvider = (
    fetchType: string,
    resource: string,
    params: DataProviderParams
) => Promise<any>;



export function chain(a: DataProvider | undefined, b: DataProvider | undefined): DataProvider {
    return async (fetchType: string, resource: string, params: DataProviderParams) => {
        if (!a) return b;
        if (!b) return a;
        try {
            const rea = await a(fetchType, resource, params)
            log(fetchType, resource, params, rea)
            return rea
        } catch (e) {
            if (e.status === 700) {
                const reb = await b(fetchType, resource, params)
                log(fetchType, resource, params, reb)
                return reb
            }
            else {
                console.error(e)
                throw e
            }
        }
    }
}


export function forResourceAndFetchTypeOneParam(resource: string, fetchType: string, dataProviderFunction: (DataProviderParams) => any): DataProvider {
    return forResourceAndFetchType(resource, fetchType, (_: string, re: string, params: DataProviderParams) => {
        return dataProviderFunction(params)
    })
}

export function forResource(resource: string | string[], dataProvider: DataProvider): DataProvider {
    return forResourceAndFetchType(resource, undefined, dataProvider)
}
export function forResourceAndFetchType(resource: string | string[] | undefined, type: string | string[] | undefined, dataProvider: DataProvider): DataProvider {
    return (fetchType: string, re: string, params: DataProviderParams) => {
        const ra: string[] = _([resource]).flatten().compact().value()
        if (ra.length > 0 && !ra.includes(re)) {
            throw new NotCovered(`resource != ${resource}`)
        }
        const types: string[] = _([type]).flatten().compact().value()
        if (types.length > 0 && !types.includes(fetchType)) {
            throw new NotCovered(`type != ${fetchType}`)
        }
        try {
            return dataProvider(fetchType, re, params)
        } catch (e) {
            throw e
        }
    }
}



/**
 * @deprecated 改了更明确的名字，使用{@link #withStaticData}
 * @param json 
 */
export function fake(json: any): DataProvider {
    if (_.isFunction(json.then)) {
        throw new Error('do not pass a promise in.')
    }
    return fakeDataProvider(json, logEnabled)
}
/**
 * @deprecated 改了更明确的名字，使用{@link #withDynamicData}
 * @param jsonFun 
 */
export function fakeForFunction(jsonFun: () => any): DataProvider {
    return async (type: string, resource: string, params: DataProviderParams) => {
        const data = jsonFun()
        if (_.isFunction(data.then)) {
            throw new Error('do not pass a promise in.')
        }
        return fake(data)(type, resource, params)
    }
}
/**
 * @deprecated 外围自行处理Promise相关问题
 * @param json 
 */
export function wrap(json: Promise<any>): Promise<DataProvider> {
    return json.then(_ => fake(_))
}
/**
 * @deprecated 外围自行处理Promise相关问题
 * @param json 
 */
export function asyncWrap(json: Promise<any>): DataProvider {
    return async (type: string, resource: string, params: DataProviderParams) => {
        const data = await json
        return fake(data)(type, resource, params)
    }
}
/**
 * @description 包装静态数据
 * @param data 初始化数据
 */
export function withStaticData(data: any): DataProvider {
    if (_.isFunction(data)) {
        return withStaticData(data())
    } else {
        return fake(data)
    }
}
/**
 * @description 每次调用都会重新加载数据
 * @param data 填充数据时调用的函数
 */
export function withDynamicData(data: any): DataProvider {
    if (_.isFunction(data)) {
        return (type: string, resource: string, params: DataProviderParams) => {
            const d = data()
            if (isPromise(d)) {
                throw new Error('do not pass a promise in.')
            }
            return fake(d)(type, resource, params)
        }
    }
    throw new Error('not implemented')
}
function isPromise(a: any) {
    if (!a) return false
    return _.isFunction(a.then)
}



