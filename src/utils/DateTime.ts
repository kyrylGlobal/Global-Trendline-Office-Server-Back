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
}

export default new DateTime();