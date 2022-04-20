import axios, { AxiosRequestConfig } from "axios";
import { NextFunction, Request, Response } from "express";
import url from 'url';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Mail from "nodemailer/lib/mailer";
import DateTime from "../utils/DateTime";

dotenv.config();

class BaselinkerRaportController {
    private token = process.env.BASELINKERTOKEN ? process.env.BASELINKERTOKEN : "undefined";
    async countOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const sortBySku = "szklarnia";
            const today = new Date();
            const startTodayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() / 1000;
            const orders = this.getListOfOrders(startTodayDate.toString());
            orders.then( orders => {
                const sortedOrdersBySku  = this.sortOrdersBySku(sortBySku, orders);
                const sortedByCountry = this.sortOrdersByCountry(sortedOrdersBySku);
                let raport = sortBySku + `(${DateTime.getCurDate()})` + "\n";
                Object.keys(sortedByCountry).forEach( key => {
                    const country = (sortedByCountry as any)[key];
                    raport += `${key} - ${country.orders.length} orders; sum - ${(country.sum as number).toFixed(2)} ${country.currency}\n`;
                })
                var transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "kyryl.global@gmail.com",
                        pass: "Whatareyoudoingglobal03011973"
                    }
                })

                var mailOptions: Mail.Options = {
                    from: "kyryl.global@gmail.com",
                    to: "kyrylpopyk@gmail.com",
                    subject: "Raport",
                    text: raport
                }

                transporter.sendMail(mailOptions, (error, info) => {
                    if(error) {
                        console.log(error);
                    } else {
                        console.log("Mail was succesfully sended.")
                    }
                })
                res.status(200).send(sortedByCountry);
            })
        }
        catch(error: any | unknown) {
            next(new Error(error.message));
        }
    }

    private async getListOfOrders(date: string): Promise<any[]> { // date cointaine date in timestamp
        return new Promise((res, rej) => {
            let orders: any[] = [];

            let params = new url.URLSearchParams({
                "token": this.token,
                "method": "getOrders",
                "parameters": JSON.stringify({
                    "get_unconfirmed_orders": "true",
                    "date_confirmed_from": date
                })
            })

            console.log(params.toString())

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

export default new BaselinkerRaportController();