import path from "path"
import Files from "../utils/Files"

export const addBarCodeToFile = async (barcode: string): Promise<string> => {
    let curDate = new Date();
    const inputData = `${curDate.toLocaleString()} - ${barcode}\r\n`;
    try {
        await Files.appendFile(path.resolve((global as any).mainFolderPath, "public", "documents", "globalTrendline", `${curDate.getDate()}_${curDate.getMonth()}_${curDate.getFullYear()}`), inputData);
        return `${barcode} was succesfully added :)`
    } catch (e: any) {
        return e.message;
    }
}