import axios from 'axios';
import url, {URLSearchParams} from 'url';
import DateTime from '../utils/DateTime';
import { getEnvData } from '../utils/Process';
import dotenv from "dotenv";

export interface GetOrdersParams {
    dateFrom: number,
    dateTo: number,
    statuses: number[]
}

dotenv.config();

class BaselinkerApiController {
    private token = process.env.BASELINKERTOKEN ? process.env.BASELINKERTOKEN : "undefined";

    public async getListOfOrdersByParams(params: GetOrdersParams) {
        let orders: any[] = await this.getListOfOrders(params.dateFrom?.toString());

        if(params.dateTo) {
            orders = orders.filter( order => order.date_add <= params.dateTo);
        }

        if(params.statuses.length > 0) {
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

    private async getListOfOrders(date: string | undefined): Promise<any[]> { // date cointaine date in timestamp
        return new Promise((res, rej) => {
            let orders: any[] = [];

            let params = new url.URLSearchParams({
                "token": this.token,
                "method": "getOrders",
                "parameters": JSON.stringify({
                    "get_unconfirmed_orders": true,
                    "date_confirmed_from": date ? date : ""
                })
            })

            axios.post('https://api.baselinker.com/connector.php', params.toString())
            .then( res => res.data)
            .then( async data => {
                orders = orders.concat(data.orders);
                console.log(`Just got orders ${orders.length}`)
                if(data.orders.length === 100) {
                    console.log(`Orders count equel 100`)
                    date = data.orders[data.orders.length - 1].date_confirmed + 1;
                    orders = orders.concat(await this.getListOfOrders(date));
                }
                res(orders);
            })
            .catch(error => rej(error))
        })
    }

    public async getListOfStatuses(): Promise<any[]> {
        return new Promise((res, rej) => {
            let statuses: any[] = [];

            let params = new url.URLSearchParams({
                "token": this.token,
                "method": "getOrderStatusList",
                "parameters": ""
            })

            axios.post('https://api.baselinker.com/connector.php', params.toString())
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
                    console.log("Coubtry is here");
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
}

export default BaselinkerApiController;