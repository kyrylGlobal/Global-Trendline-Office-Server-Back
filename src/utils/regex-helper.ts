export function getDataArray(regex: RegExp, data: string): string[] {
    const results: string[] = [];
    let regexResult: RegExpExecArray | null;

    while(regexResult = regex.exec(data)) {
        if(regexResult && regexResult[1]){
            results.push(regexResult[1]);
        }
    }

    return results;
}

export function getData(regex: RegExp, data: string): string {
    let result: string = "";
    let regexResult: RegExpExecArray | null = regex.exec(data);

    if(regexResult && regexResult[1]) {
        result = regexResult[1];
    }

    return result;
}


