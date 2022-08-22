"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getData = exports.getDataArray = void 0;
function getDataArray(regex, data) {
    const results = [];
    let regexResult;
    while (regexResult = regex.exec(data)) {
        if (regexResult && regexResult[1]) {
            results.push(regexResult[1]);
        }
    }
    return results;
}
exports.getDataArray = getDataArray;
function getData(regex, data) {
    let result = "";
    let regexResult = regex.exec(data);
    if (regexResult && regexResult[1]) {
        result = regexResult[1];
    }
    return result;
}
exports.getData = getData;
