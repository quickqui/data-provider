import fakeDataProvider from './fake-data';

function log(type, resource, params, response) {
    if (console.group) {
        // Better logging in Chrome
        console.groupCollapsed(type, resource, JSON.stringify(params));
        console.log(response);
        console.groupEnd();
    } else {
        console.log('FakeRest request ', type, resource, params);
        console.log('FakeRest response', response);
    }
}

class NotCovered extends Error {
    status = 700
    message = 'NotCovered'
    constructor(me: string) {
        super()
        this.message = 'NotCovered - ' + me
    }
}

export let logEnabled = false

export type DataProviderParams = { [key: string]: any }

export type DataProvider = (
    fetchType: string,
    resource: string,
    params: DataProviderParams
) => Promise<any>;



export function chain(a: DataProvider, b: DataProvider): DataProvider {
    return async (fetchType: string, resource: string, params: DataProviderParams) => {
        if(!a) return b;
        if(!b) return a;
        try {
            return await a(fetchType, resource, params)
        } catch (e) {
            if (e.status === 700)
                return b(fetchType, resource, params)
            else
                throw e
        }
    }
}


export function forResource(resource: string | string[], dataProvider: DataProvider): DataProvider {
    return async (fetchType: string, re: string, params: DataProviderParams) => {
        const ra: string[] = [resource].flat()
        if (!ra.includes(re)) {
            throw new NotCovered(`resource != ${resource}`)
        }
        try {
            return await dataProvider(fetchType, re, params)
        } catch (e) {
            throw e
        }
    }
}

export function fake(json: any): DataProvider {
    return fakeDataProvider(json,logEnabled)
}

export function fakeForFunction(jsonFun: () => any): DataProvider {
    return async (type: string, resource: string, params: DataProviderParams) => {
        const data = jsonFun()
        return fake(data)(type, resource, params)
    }
}

export function wrap(json: Promise<any>): Promise<DataProvider> {
    return json.then(_ => fake(_))
}
export function asyncWrap(json: Promise<any>): DataProvider {
    return async (type: string, resource: string, params: DataProviderParams) => {
        const data = await json
        return fake(data)(type, resource, params)
    }
}




