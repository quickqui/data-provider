import fakeDataProvider from './fake-data';
class NotCovered extends Error {
    constructor(me) {
        super();
        this.status = 700;
        this.message = 'NotCovered';
        this.message = 'NotCovered - ' + me;
    }
}
export function chain(a, b) {
    return async (fetchType, resource, params) => {
        try {
            return await a(fetchType, resource, params);
        }
        catch (e) {
            if (e.status === 700)
                return b(fetchType, resource, params);
            else
                throw e;
        }
    };
}
export function forResource(resource, dataProvider) {
    return async (fetchType, re, params) => {
        const ra = [resource].flat();
        if (!ra.includes(re)) {
            throw new NotCovered(`resource != ${resource}`);
        }
        try {
            return await dataProvider(fetchType, re, params);
        }
        catch (e) {
            throw e;
        }
    };
}
export function fake(json) {
    return fakeDataProvider(json);
}
export function wrap(json) {
    return json.then(_ => fake(_));
}
export function asyncWrap(json) {
    return async (type, resource, params) => {
        const data = await json;
        return fake(data)(type, resource, params);
    };
}
//# sourceMappingURL=DataProviders.js.map