import axios from "axios";
import { BackResponse, GetInvoiceAccountantDataResponseBody } from "../types";

class BaselinkerDb {
    public async getInvoiceDataByInvoiceNumbers(invoicesNumbers: string[]) {
        try {
            const response = await axios.post('https://global-trenline-tech.xyz/admin/api/v1/openApi/get/accountant/invoices/data', {invoices: invoicesNumbers});

            const body = response.data as BackResponse<GetInvoiceAccountantDataResponseBody>;

            if(body.error) {
                throw new Error(`Unable to collect invoices data. Message: ${body.message}`);
            }

            return body.data;
        } catch (e: any) {
            throw new Error(`Unable to collect invoices data. Message: ${e.message}`);
        }
    }
}

export default BaselinkerDb;