interface UpdaterInfo {
    days: number,
    mounth: number,
    years: number
}

class DateTime{

    /**
     * 
     * @returns curent date like "01.01.1999"
     */
    getCurDate(): string{
        const dateTime = new Date();
        const day: string = dateTime.getDate() < 10 ? `0${dateTime.getDate()}`: dateTime.getDate().toString();
        const month: string = (dateTime.getMonth() + 1) < 10 ? `0${dateTime.getMonth() + 1}`: (dateTime.getMonth() + 1).toString();
        const year = dateTime.getFullYear();
        
        return `${day}:${month}:${year}`;
    }

    /**
     * 
     * @returns curent time like "00:00:00"
     */
     getCurTime(): string{
        const dateTime = new Date();
        const hours = dateTime.getHours() < 10 ? `0${dateTime.getHours()}`: dateTime.getHours().toString();
        const minutes = dateTime.getMinutes() < 10 ? `0${dateTime.getMinutes()}`: dateTime.getMinutes().toString();
        const seconds = dateTime.getSeconds() < 10 ? `0${dateTime.getSeconds()}`: dateTime.getSeconds().toString();
        
        return `${hours}:${minutes}:${seconds}`;
    }

    updateDate(dateString: string, updaterInfo: UpdaterInfo) {
        let dateArray = dateString.split("-");
        let date = new Date(parseInt(dateArray[0]), parseInt(dateArray[1]) - 1, parseInt(dateArray[2]));
        date.setDate(date.getDate() + updaterInfo.days);
        date.setMonth(date.getMonth() + updaterInfo.mounth);
        date.setFullYear(date.getFullYear() + updaterInfo.years)
        let day = date.getDate().toString();
        let mounth = (date.getMonth() + 1).toString();
        let year = date.getFullYear().toString();
        if(parseInt(day) < 10) {
            day = 0 + day;
        }
        if(parseInt(mounth) < 10) {
            mounth = 0 + mounth;
        }
        if(mounth === "00") {
            mounth = "01";
        }
        return `${year}-${mounth}-${day}`
    }


    convertDateToUnix(date: Date): number {
        return Math.floor(date.getTime() / 1000)
    }

    getCurDayUnix() {
        const curDate = new Date();
        const curSecondsUnix = curDate.getSeconds() * 1000;
        const curMinutesUnix = curDate.getMinutes() * 60 * 1000;
        const curHoursUnix = curDate.getHours() * 60 * 60 * 1000;
        return Math.floor((curDate.getTime() - curSecondsUnix - curMinutesUnix - curHoursUnix) / 1000);
    }

    addDaysToUnix(unix: number, countOfDays: number) {
        return unix + ((24 * 60 * 60) * countOfDays);
    }
}

export default new DateTime();