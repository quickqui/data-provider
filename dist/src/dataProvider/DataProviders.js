"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fake_data_1 = __importDefault(require("./fake-data"));
class NotCovered extends Error {
    constructor(me) {
        super();
        this.status = 700;
        this.message = 'NotCovered';
        this.message = 'NotCovered - ' + me;
    }
}
function chain(a, b) {
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
exports.chain = chain;
function forResource(resource, dataProvider) {
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
exports.forResource = forResource;
function fake(json) {
    return fake_data_1.default(json);
}
exports.fake = fake;
function wrap(json) {
    return json.then(_ => fake(_));
}
exports.wrap = wrap;
function asyncWrap(json) {
    return async (type, resource, params) => {
        const data = await json;
        return fake(data)(type, resource, params);
    };
}
exports.asyncWrap = asyncWrap;
//# sourceMappingURL=DataProviders.js.map