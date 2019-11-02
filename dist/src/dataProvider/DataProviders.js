"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fake_data_1 = __importDefault(require("./fake-data"));
const lodash_1 = __importDefault(require("lodash"));
function log(type, resource, params, response) {
    if (!logEnabled)
        return;
    // Better logging in Chrome
    console.groupCollapsed(type, resource, JSON.stringify(params));
    console.log(response);
    console.groupEnd();
}
class NotCovered extends Error {
    constructor(me) {
        super();
        this.status = 700;
        this.message = 'NotCovered';
        this.message = 'NotCovered - ' + me;
    }
}
exports.NotCovered = NotCovered;
let logEnabled = false;
function setLogEnabled(enabled) {
    logEnabled = enabled;
}
exports.setLogEnabled = setLogEnabled;
function chain(a, b) {
    return async (fetchType, resource, params) => {
        if (!a)
            return b;
        if (!b)
            return a;
        try {
            const rea = await a(fetchType, resource, params);
            log(fetchType, resource, params, rea);
            return rea;
        }
        catch (e) {
            if (e.status === 700) {
                const reb = await b(fetchType, resource, params);
                log(fetchType, resource, params, reb);
                return reb;
            }
            else {
                console.error(e);
                throw e;
            }
        }
    };
}
exports.chain = chain;
function forResourceAndFetchTypeF(resource, fetchType, dataProviderFunction) {
    return forResourceAndFetchType(resource, fetchType, (_, re, params) => {
        return dataProviderFunction(params);
    });
}
exports.forResourceAndFetchTypeF = forResourceAndFetchTypeF;
function forResource(resource, dataProvider) {
    return forResourceAndFetchType(resource, undefined, dataProvider);
}
exports.forResource = forResource;
function forResourceAndFetchType(resource, type, dataProvider) {
    return (fetchType, re, params) => {
        const ra = lodash_1.default([resource]).flatten().compact().value();
        if (ra.length > 0 && !ra.includes(re)) {
            throw new NotCovered(`resource != ${resource}`);
        }
        const types = lodash_1.default([type]).flatten().compact().value();
        if (types.length > 0 && !types.includes(fetchType)) {
            throw new NotCovered(`type != ${fetchType}`);
        }
        try {
            return dataProvider(fetchType, re, params);
        }
        catch (e) {
            throw e;
        }
    };
}
exports.forResourceAndFetchType = forResourceAndFetchType;
/**
 * @deprecated 改了更明确的名字，使用{@link #withStaticData}
 * @param json
 */
function fake(json) {
    if (lodash_1.default.isFunction(json.then)) {
        throw new Error('do not pass a promise in.');
    }
    return fake_data_1.default(json, logEnabled);
}
exports.fake = fake;
/**
 * @deprecated 改了更明确的名字，使用{@link #withDynamicData}
 * @param jsonFun
 */
function fakeForFunction(jsonFun) {
    return async (type, resource, params) => {
        const data = jsonFun();
        if (lodash_1.default.isFunction(data.then)) {
            throw new Error('do not pass a promise in.');
        }
        return fake(data)(type, resource, params);
    };
}
exports.fakeForFunction = fakeForFunction;
/**
 * @deprecated 外围自行处理Promise相关问题
 * @param json
 */
function wrap(json) {
    return json.then(_ => fake(_));
}
exports.wrap = wrap;
/**
 * @deprecated 外围自行处理Promise相关问题
 * @param json
 */
function asyncWrap(json) {
    return async (type, resource, params) => {
        const data = await json;
        return fake(data)(type, resource, params);
    };
}
exports.asyncWrap = asyncWrap;
/**
 * @description 包装静态数据
 * @param data 初始化数据
 */
function withStaticData(data) {
    if (lodash_1.default.isFunction(data)) {
        return withStaticData(data());
    }
    else {
        return fake(data);
    }
}
exports.withStaticData = withStaticData;
/**
 * @description 每次调用都会重新加载数据
 * @param data 填充数据时调用的函数
 */
function withDynamicData(data) {
    if (lodash_1.default.isFunction(data)) {
        return (type, resource, params) => {
            const d = data();
            if (isPromise(d)) {
                throw new Error('do not pass a promise in.');
            }
            return fake(d)(type, resource, params);
        };
    }
    throw new Error('not implemented');
}
exports.withDynamicData = withDynamicData;
function isPromise(a) {
    if (!a)
        return false;
    return lodash_1.default.isFunction(a.then);
}
//# sourceMappingURL=DataProviders.js.map