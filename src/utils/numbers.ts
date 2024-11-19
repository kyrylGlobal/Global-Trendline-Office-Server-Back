export function floatSum(numbers: number[], toFixed: number = 2) {
    let sumOfNumbers = 0;
    for(let number of numbers) {
        sumOfNumbers = Number.parseFloat((sumOfNumbers + number).toFixed(toFixed));
    }

    return sumOfNumbers;
}

export function floatMultiply(numbers: number[], toFixed: number = 2) {
    let multiplyOfNumbers = 1;
    for(let number of numbers) {
        multiplyOfNumbers = Number.parseFloat((multiplyOfNumbers * number).toFixed(toFixed));
    }

    return multiplyOfNumbers;
}