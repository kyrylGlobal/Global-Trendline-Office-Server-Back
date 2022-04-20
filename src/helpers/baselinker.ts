export const filterStatusesByName = (statuses: any[], regex: RegExp): any => statuses.filter( (status) => regex.test(status.name));


export function combineStatuseByCountry(readyStatuses: any[], sendStatuses: any[]): any {
    let combinedStatuses: any = {}
    if(readyStatuses.length != sendStatuses.length) {
        throw new Error("Length of ready and sent statuses is different. Please check name format of each statuses");
    }

    for(let [index, readyStatus] of readyStatuses.entries()) {
        const statusName = readyStatus.name;
        const statusCountryRegexData = (statusName as string).match(/^Ready (\w\w)$/);
        if(statusCountryRegexData != null && statusCountryRegexData[1]) {
            let statusCountry = statusCountryRegexData[1];
            combinedStatuses[statusCountry] = {};
            combinedStatuses[statusCountry]["ready"] = readyStatus;
            // combinedStatuses[statusCountry]["sent"] = sendStatuses[index];
            sendStatuses.forEach( sendStatus => {
                if((sendStatus.name as string).includes(statusCountry)) {
                    combinedStatuses[statusCountry]["sent"] = sendStatus;
                }
            })
        }
    }

    return combinedStatuses;
}