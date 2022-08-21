import { GoogleAuth } from "google-auth-library";
import { JSONClient } from "google-auth-library/build/src/auth/googleauth";
import { google } from "googleapis";

class Google {
    readonly spreadsheetId: string;

    constructor(spreadSheetId: string) {
        this.spreadsheetId = spreadSheetId;
    }

    async addData(sheetName: string, range: string, values: any[]) {
        const auth = new google.auth.GoogleAuth({
            keyFile: "keys.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets"
        });

        const authClientObject = await auth.getClient();

        const instance =  google.sheets({version: "v4", auth: authClientObject});
        await instance.spreadsheets.values.update({
            auth: auth,
            spreadsheetId: this.spreadsheetId,
            range: `${sheetName}!${range}`,
            valueInputOption: "RAW",
            requestBody: {
                values: values
            }
        })
    }

    async getDataFromCell(sheetName: string, range: string) {
        const auth = new google.auth.GoogleAuth({
            keyFile: "keys.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets"
        });

        const authClientObject = await auth.getClient();

        const instance =  google.sheets({version: "v4", auth: authClientObject});
        const response =  await instance.spreadsheets.values.get({
            auth,
            spreadsheetId: this.spreadsheetId,
            range: `${sheetName}!${range}`
        })

        if(response && response.data.values) {
            return response.data.values[0][0];
        }
    }
}

export default Google;