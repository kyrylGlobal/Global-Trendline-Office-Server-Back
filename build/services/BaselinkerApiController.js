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
dotenv_1.default.config();
class BaselinkerApiController {
    constructor() {
        this.token = process.env.BASELINKERTOKEN ? process.env.BASELINKERTOKEN : "undefined";
    }
    getListOfOrdersByParams(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let orders = yield this.getListOfOrders((_a = params.dateFrom) === null || _a === void 0 ? void 0 : _a.toString());
            if (params.dateTo) {
                orders = orders.filter(order => order.date_add <= params.dateTo);
            }
            if (params.statuses.length > 0) {
                const statusIds = params.statuses;
                orders = orders.filter(order => {
                    if (statusIds.includes(order.order_status_id)) {
                        return true;
                    }
                    return false;
                });
            }
            return orders;
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
                        "date_confirmed_from": date ? date : ""
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
    getListOfStatuses() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                let statuses = [];
                let params = new url_1.default.URLSearchParams({
                    "token": this.token,
                    "method": "getOrderStatusList",
                    "parameters": ""
                });
                axios_1.default.post('https://api.baselinker.com/connector.php', params.toString())
                    .then(res => res.data)
                    .then((data) => __awaiter(this, void 0, void 0, function* () {
                    res(data.statuses);
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
exports.default = BaselinkerApiController;
