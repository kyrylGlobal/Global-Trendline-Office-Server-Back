"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const url_1 = __importDefault(require("url"));
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const DateTime_1 = __importDefault(require("../utils/DateTime"));
dotenv_1.default.config();
class BaselinkerRaportController {
    constructor() {
        this.token = process.env.BASELINKERTOKEN ? process.env.BASELINKERTOKEN : "undefined";
    }
    countOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sortBySku = "szklarnia";
                const today = new Date();
                const startTodayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() / 1000;
                const orders = this.getListOfOrders(startTodayDate.toString());
                orders.then(orders => {
                    const sortedOrdersBySku = this.sortOrdersBySku(sortBySku, orders);
                    const sortedByCountry = this.sortOrdersByCountry(sortedOrdersBySku);
                    let raport = sortBySku + `(${DateTime_1.default.getCurDate()})` + "\n";
                    Object.keys(sortedByCountry).forEach(key => {
                        const country = sortedByCountry[key];
                        raport += `${key} - ${country.orders.length} orders; sum - ${country.sum.toFixed(2)} ${country.currency}\n`;
                    });
                    var transporter = nodemailer_1.default.createTransport({
                        service: "gmail",
                        auth: {
                            user: "kyryl.global@gmail.com",
                            pass: "Whatareyoudoingglobal03011973"
                        }
                    });
                    var mailOptions = {
                        from: "kyryl.global@gmail.com",
                        to: "kyrylpopyk@gmail.com",
                        subject: "Raport",
                        text: raport
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log("Mail was succesfully sended.");
                        }
                    });
                    res.status(200).send(sortedByCountry);
                });
            }
            catch (error) {
                next(new Error(error.message));
            }
        });
    }
    getListOfOrders(date) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                let orders = [];
                let params = new url_1.default.URLSearchParams({
                    "token": this.token,
                    "method": "getOrders",
                    "parameters": JSON.stringify({
                        "get_unconfirmed_orders": "true",
                        "date_confirmed_from": date
                    })
                });
                axios_1.default.post('https://api.baselinker.com/connector.php', params.toString())
                    .then(res => res.data)
                    .then((data) => __awaiter(this, void 0, void 0, function* () {
                    orders = orders.concat(data.orders);
                    console.log(`Just got orders ${orders.length}`);
                    if (data.orders.length === 100) {
                        console.log(`Orders count equel 100`);
                        date = data.orders[data.orders.length - 1].date_confirmed + 1;
                        orders = orders.concat(yield this.getListOfOrders(date));
                    }
                    res(orders);
                }))
                    .catch(error => rej(error));
            });
        });
    }
    sortOrdersBySku(sku, orders) {
        let sortedOrders = [];
        orders.forEach(order => {
            order.products.every(product => {
                if (product.sku.includes(sku)) {
                    sortedOrders.push(order);
                    return false;
                }
                return true;
            });
        });
        return sortedOrders;
    }
    sortOrdersByCountry(orders, countryCode) {
        let sortedOrders = {};
        if (countryCode) {
        }
        else {
            orders.forEach(order => {
                if (sortedOrders[order.delivery_country_code]) {
                    console.log("Coubtry is here");
                    sortedOrders[order.delivery_country_code].orders.push(order);
                }
                else {
                    sortedOrders[order.delivery_country_code] = {};
                    sortedOrders[order.delivery_country_code].orders = [order];
                    sortedOrders[order.delivery_country_code].sum = 0;
                    sortedOrders[order.delivery_country_code].currency = order.currency;
                }
                sortedOrders[order.delivery_country_code].sum += order.products.reduce((previous, current) => { return previous + (current.price_brutto * current.quantity); }, 0);
            });
        }
        return sortedOrders;
    }
}
exports.default = new BaselinkerRaportController();
