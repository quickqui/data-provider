"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fakerest_1 = __importDefault(require("fakerest"));
const dataFetchActions_1 = require("./dataFetchActions");
/* eslint-disable no-console */
function log(type, resource, params, response) {
    if (console.group) {
        // Better logging in Chrome
        console.groupCollapsed(type, resource, JSON.stringify(params));
        console.log(response);
        console.groupEnd();
    }
    else {
        console.log('FakeRest request ', type, resource, params);
        console.log('FakeRest response', response);
    }
}
/**
 * Respond to react-admin data queries using a local JavaScript object
 *
 * Useful for debugging and testing - do not use in production.
 *
 * @example
 * import fakeDataProvider from 'ra-data-fakerest';
 * const dataProvider = fakeDataProvider({
 *   posts: [
 *     { id: 0, title: 'Hello, world!' },
 *     { id: 1, title: 'FooBar' },
 *   ],
 *   comments: [
 *     { id: 0, post_id: 0, author: 'John Doe', body: 'Sensational!' },
 *     { id: 1, post_id: 0, author: 'Jane Doe', body: 'I agree' },
 *   ],
 * })
 */
exports.default = (data, loggingEnabled = false) => {
    const restServer = new fakerest_1.default.Server();
    restServer.init(data);
    // if (window) {
    //     window.restServer = restServer; // give way to update data in the console
    // }
    function getResponse(type, resource, params) {
        switch (type) {
            case dataFetchActions_1.GET_LIST: {
                const { page, perPage } = params.pagination;
                const { field, order } = params.sort;
                const query = {
                    sort: [field, order],
                    range: [(page - 1) * perPage, page * perPage - 1],
                    filter: params.filter,
                };
                return {
                    data: restServer.getAll(resource, query),
                    total: restServer.getCount(resource, {
                        filter: params.filter,
                    }),
                };
            }
            case dataFetchActions_1.GET_ONE:
                return {
                    data: restServer.getOne(resource, params.id, { ...params }),
                };
            case dataFetchActions_1.GET_MANY:
                return {
                    data: restServer.getAll(resource, {
                        filter: { id: params.ids },
                    }),
                };
            case dataFetchActions_1.GET_MANY_REFERENCE: {
                const { page, perPage } = params.pagination;
                const { field, order } = params.sort;
                const query = {
                    sort: [field, order],
                    range: [(page - 1) * perPage, page * perPage - 1],
                    filter: { ...params.filter, [params.target]: params.id },
                };
                return {
                    data: restServer.getAll(resource, query),
                    total: restServer.getCount(resource, {
                        filter: query.filter,
                    }),
                };
            }
            case dataFetchActions_1.UPDATE:
                return {
                    data: restServer.updateOne(resource, params.id, {
                        ...params.data,
                    }),
                };
            case dataFetchActions_1.UPDATE_MANY:
                params.ids.forEach(id => restServer.updateOne(resource, id, {
                    ...params.data,
                }));
                return { data: params.ids };
            case dataFetchActions_1.CREATE:
                return {
                    data: restServer.addOne(resource, { ...params.data }),
                };
            case dataFetchActions_1.DELETE:
                return { data: restServer.removeOne(resource, params.id) };
            case dataFetchActions_1.DELETE_MANY:
                params.ids.forEach(id => restServer.removeOne(resource, id));
                return { data: params.ids };
            default:
                return false;
        }
    }
    /**
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The data request params, depending on the type
     * @returns {Promise} The response
     */
    return (type, resource, params) => {
        const collection = restServer.getCollection(resource);
        if (!collection) {
            return new Promise((_, reject) => reject(new Error(`Undefined collection "${resource}", (don't set promises as fake data)`)));
        }
        let response;
        try {
            response = getResponse(type, resource, params);
        }
        catch (error) {
            return new Promise((_, reject) => reject(error));
        }
        if (response === false) {
            return new Promise((_, reject) => reject(new Error(`Unsupported fetch action type ${type}`)));
        }
        if (loggingEnabled) {
            log(type, resource, params, response);
        }
        return new Promise(resolve => resolve(response));
    };
};
//# sourceMappingURL=fake-data.js.map