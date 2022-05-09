import axios from 'axios';
import url, {URLSearchParams} from 'url';
import { getEnvData } from '../utils/Process';

class BaselinkerApiController {
    private readonly apiToken: string;

    constructor(apiToken?: string) {
        if(apiToken) {
            this.apiToken = apiToken;
        } else {
            const envData = getEnvData("BASELINKERTOKEN");
            if(envData) {
                this.apiToken = envData;
            } else {
                throw new Error("Baselinker apiToken was not provided. Please add baselinker api token variable to .env");
            }
        }
    }

    public async getStatuses(): Promise<any> {
        let params = this.createBaselinkerApiParams("getOrderStatusList", {});

        return await this.makeBaselinkerPost(params);
    }

    public async getOrders(status_id?: any): Promise<any[]> {
        let params = this.createBaselinkerApiParams(
            "getOrders", 
            {
                status_id,
                "get_unconfirmed_orders": true
            }
        )
        let lastOrdersSet = false;
        let orders: any[] = [];

        while (!lastOrdersSet) {
            const setOfOrders = (await this.makeBaselinkerPost(params)).orders;
            orders = orders.concat(setOfOrders);

            if(setOfOrders.length === 100) {
                params = this.createBaselinkerApiParams(
                    "getOrders",
                    {
                        status_id,
                        "get_unconfirmed_orders": true,
                        "date_from": setOfOrders[setOfOrders.length - 1].date_add
                    }
                )
            } else if(setOfOrders.length > 0 && setOfOrders.length < 100) {
                lastOrdersSet = true;
            } else if(setOfOrders.length < 0) {
                throw new Error(`Order length is ${setOfOrders.length}. Something wrong with Baselinker API :(`)
            } else {
                lastOrdersSet = true;
            }
        }

        return orders;
    }

    public async setOrderStatus(orderId: string | number, statusId: string | number) {
        let params = this.createBaselinkerApiParams(
            "setOrderStatus",
            {
                "order_id": orderId,
                "status_id": statusId
            }
        )

        return this.makeBaselinkerPost(params);
    }

    public async addOrders(orders: any[]) {
        orders.forEach( async order => {
            let params = this.createBaselinkerApiParams(
                "addOrder",
                order
            )
            
            let result = await this.makeBaselinkerPost(params);
            if(result) {
                console.log()
            } else {
                console.log()
            }
        })
    }

    public async getOrderStatusIdByName(orderName: string) {
        let orderStatuses = (await this.getStatuses()).statuses;
        for( let orderStatusData of orderStatuses) {
            if(orderStatusData.name === orderName) {
                return orderStatusData.id;
            }
        }
    }

    private async makeBaselinkerPost(params: string): Promise<any> {
        return await axios.post('https://api.baselinker.com/connector.php', params)
        .then( res => res.data)
        .catch(error => console.log(error))
    }

    private createBaselinkerApiParams(method: string, params: Object): string {
        const urlSearchParams: URLSearchParams = new URLSearchParams({
            "token": this.apiToken,
            "method": method,
            "parameters": JSON.stringify(params)
        })

        return urlSearchParams.toString();
    }
}

export default BaselinkerApiController;