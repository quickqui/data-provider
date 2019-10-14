"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataProviders_1 = require("./DataProviders");
class DataProviderWrap {
    constructor(dataProvider) {
        this._dp = dataProvider;
    }
    value() {
        return this._dp;
    }
    chain(dp) {
        return new DataProviderWrap(DataProviders_1.chain(this._dp, dp));
    }
}
const emptyDataProvider = (type, resource, param) => {
    throw new DataProviders_1.NotCovered('from emptyDataProvider');
};
Object.prototype.staticWrapToDataProvider = function () {
    return new DataProviderWrap(DataProviders_1.withStaticData(this));
};
function withDynamicData(fun) {
    return new DataProviderWrap(DataProviders_1.withDynamicData(fun));
}
exports.withDynamicData = withDynamicData;
function w() {
    return new DataProviderWrap(emptyDataProvider);
}
exports.w = w;
//# sourceMappingURL=Wrapper.js.map