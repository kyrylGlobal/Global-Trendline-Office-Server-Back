import axios from 'axios';
import url, {URLSearchParams} from 'url';
import DateTime from '../utils/DateTime';
import { getEnvData } from '../utils/Process';
import dotenv from "dotenv";

export interface GetOrdersInputParams {
    dateFrom?: number,
    statusId?: number
}

export interface GetOrdersParams extends GetOrdersInputParams {
    dateTo?: number,
    statuses?: number[],
    severalFolder: boolean
}

dotenv.config();

class BaselinkerApiController {
    private token = process.env.BASELINKERTOKEN ? process.env.BASELINKERTOKEN : "undefined";

    public async getListOfOrdersByParams(params: GetOrdersParams) {
        let orders: any[] = [];
        if(params.severalFolder && params.statuses) {
            for(let statusId of params.statuses) {
                orders = orders.concat(await this.getListOfOrders({"dateFrom": params.dateFrom, statusId: statusId}));
            }
        } else {
            orders = await this.getListOfOrders({"dateFrom": params.dateFrom, statusId: params.statusId});
        }

        if(params.dateTo) {
            orders = orders.filter( order => params.dateTo && order.date_add <= params.dateTo);
        }

        if(params.statuses && params.statuses.length > 0) {
            const statusIds = params.statuses;
            orders = orders.filter( order => {
                if(statusIds.includes(order.order_status_id)) {
                    return true;
                }
                return false;
            })
        }

        return orders;
    }

    public async getListOfStatusesIdsByNames(statusesName: string[], equal: boolean): Promise<number[]> {
        let bStatuses = await this.getListOfStatuses();
        let resultStatusesIds: number[] = [];
        bStatuses.forEach( bStatus => {
            statusesName.forEach( statusName => {
                if(bStatus.name.include(statusName)) {
                    resultStatusesIds.push(bStatus.id);
                }
            })
        })

        return resultStatusesIds;
    }

    private async getListOfOrders(params: GetOrdersInputParams): Promise<any[]> { // date cointaine date in timestamp
        return new Promise((res, rej) => {
            let orders: any[] = [];

            let stringParams = this.generateBaselinkerRequestConfig(
                "getOrders", {
                    "get_unconfirmed_orders": true, "date_from": params.dateFrom,
                    "status_id": params.statusId
                }
            );

            axios.post('https://api.baselinker.com/connector.php', stringParams)
            .then( res => res.data)
            .then( async data => {
                orders = orders.concat(data.orders);
                if(data.orders.length === 100) {
                    params.dateFrom = data.orders[data.orders.length - 1].date_add + 1;
                    orders = orders.concat(await this.getListOfOrders(params));
                }
                res(orders);
            })
            .catch(error => rej(error))
        })
    }

    public async getListOfStatuses(): Promise<any[]> {
        return new Promise((res, rej) => {
            let params = this.generateBaselinkerRequestConfig("getOrderStatusList");

            axios.post('https://api.baselinker.com/connector.php', params)
            .then( res => res.data)
            .then( async data => {
                res(data.statuses);
            })
            .catch(error => rej(error))
        })
    }
    
    private sortOrdersBySku(sku: string, orders: any[]) : any[] {
        let sortedOrders: any[] = [];

        orders.forEach( order => {
            (order.products as Array<any>).every( product => {
                if((product.sku as string).includes(sku)) {
                    sortedOrders.push(order);
                    return false;
                }
                return true;
            })
        })

        return sortedOrders;
    }

    private sortOrdersByCountry(orders: any[], countryCode?: string): Object {
        let sortedOrders: any = {};
        if(countryCode) {

        } else {
            orders.forEach( order => {
                if(sortedOrders[order.delivery_country_code]) {
                    sortedOrders[order.delivery_country_code].orders.push(order);
                } else {
                    sortedOrders[order.delivery_country_code] = {};
                    sortedOrders[order.delivery_country_code].orders = [order];
                    sortedOrders[order.delivery_country_code].sum = 0;
                    sortedOrders[order.delivery_country_code].currency = order.currency;
                }
                sortedOrders[order.delivery_country_code].sum += (order.products as Array<any>).reduce( (previous, current) => { return previous + (current.price_brutto * current.quantity)}, 0)
            })
        }

        return sortedOrders;
    }

    private generateBaselinkerRequestConfig(method: string, params?: Object): string {
        return new url.URLSearchParams({
            "token": this.token,
            "method": method,
            "parameters": params ? JSON.stringify(params) : ""
        }).toString();
    }

    public async setOrdersProductFields(configParams: Object) {
        let requestParams = this.generateBaselinkerRequestConfig("setOrderProductFields", configParams);
        const res = await axios.post('https://api.baselinker.com/connector.php', requestParams);
        return res.data;
    }
}

export default BaselinkerApiController;