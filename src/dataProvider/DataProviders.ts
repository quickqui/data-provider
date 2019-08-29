import fakeDataProvider from './fake-data';



class NotCovered extends Error {
    status = 700
    message = 'NotCovered'
    constructor(me: string) {
        super()
        this.message = 'NotCovered - ' + me
    }
}

export type DataProviderParams = { [key: string]: any }

export type DataProvider = (
    fetchType: string,
    resource: string,
    params: DataProviderParams
) => Promise<any>;



export function chain(a: DataProvider, b: DataProvider): DataProvider {
    return async (fetchType: string, resource: string, params: DataProviderParams) => {
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


export function forResource(resource: string | string[] , dataProvider: DataProvider): DataProvider {
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

export function fake(json:any) : DataProvider{
    return fakeDataProvider(json)
}






