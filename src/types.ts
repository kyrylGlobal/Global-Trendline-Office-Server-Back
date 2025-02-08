export type InvoiceAccountantData = {
    baselinkerOrderId: string,
    storeOrderId: string,
    userLogin: string,
    orderSourceId: string,
    orderSource: string,
    extraFieldOne: string,
    deliveryPackage: string
}

export interface GetInvoiceAccountantDataResponseBody {
    [invoice: string]: InvoiceAccountantData
}

export interface BackResponse<ResponseData> {
    error: boolean,
    message: string,
    data: ResponseData
}
