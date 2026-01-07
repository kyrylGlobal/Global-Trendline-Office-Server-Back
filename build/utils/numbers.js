"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.floatMultiply = exports.floatSum = void 0;
function floatSum(numbers, toFixed = 2) {
    let sumOfNumbers = 0;
    for (let number of numbers) {
        sumOfNumbers = Number.parseFloat((sumOfNumbers + number).toFixed(toFixed));
    }
    return sumOfNumbers;
}
exports.floatSum = floatSum;
function floatMultiply(numbers, toFixed = 2) {
    let multiplyOfNumbers = 1;
    for (let number of numbers) {
        multiplyOfNumbers = Number.parseFloat((multiplyOfNumbers * number).toFixed(toFixed));
    }
    return multiplyOfNumbers;
}
exports.floatMultiply = floatMultiply;
