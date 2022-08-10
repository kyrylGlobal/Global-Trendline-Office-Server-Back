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
const url_1 = require("url");
const DateTime_1 = __importDefault(require("../utils/DateTime"));
const Process_1 = require("../utils/Process");
class BaselinkerApiController {
    constructor(apiToken) {
        if (apiToken) {
            this.apiToken = apiToken;
        }
        else {
            const envData = (0, Process_1.getEnvData)("BASELINKERTOKEN");
            if (envData) {
                this.apiToken = envData;
            }
            else {
                throw new Error("Baselinker apiToken was not provided. Please add baselinker api token variable to .env");
            }
        }
    }
    getStatuses() {
        return __awaiter(this, void 0, void 0, function* () {
            let params = this.createBaselinkerApiParams("getOrderStatusList", {});
            return yield this.makeBaselinkerPost(params);
        });
    }
    getOrders(getOrdersParams) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = this.createBaselinkerApiParams("getOrders", {
                status_id: getOrdersParams === null || getOrdersParams === void 0 ? void 0 : getOrdersParams.statusId,
                "get_unconfirmed_orders": true,
                "date_from": DateTime_1.default.getCurDayUnix()
            });
            let lastOrdersSet = false;
            let orders = [];
            while (!lastOrdersSet) {
                const setOfOrders = (yield this.makeBaselinkerPost(params)).orders;
                orders = orders.concat(setOfOrders);
                if (setOfOrders.length === 100) {
                    params = this.createBaselinkerApiParams("getOrders", {
                        status_id: getOrdersParams === null || getOrdersParams === void 0 ? void 0 : getOrdersParams.statusId,
                        "get_unconfirmed_orders": true,
                        "date_from": setOfOrders[setOfOrders.length - 1].date_add
                    });
                }
                else if (setOfOrders.length > 0 && setOfOrders.length < 100) {
                    lastOrdersSet = true;
                }
                else if (setOfOrders.length < 0) {
                    throw new Error(`Order length is ${setOfOrders.length}. Something wrong with Baselinker API :(`);
                }
                else {
                    lastOrdersSet = true;
                }
            }
            return orders;
        });
    }
    setOrderStatus(orderId, statusId) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = this.createBaselinkerApiParams("setOrderStatus", {
                "order_id": orderId,
                "status_id": statusId
            });
            return this.makeBaselinkerPost(params);
        });
    }
    addOrders(orders) {
        return __awaiter(this, void 0, void 0, function* () {
            orders.forEach((order) => __awaiter(this, void 0, void 0, function* () {
                let params = this.createBaselinkerApiParams("addOrder", order);
                let result = yield this.makeBaselinkerPost(params);
                if (result) {
                    console.log();
                }
                else {
                    console.log();
                }
            }));
        });
    }
    getOrderStatusIdByName(statusName) {
        return __awaiter(this, void 0, void 0, function* () {
            let orderStatuses = (yield this.getStatuses()).statuses;
            for (let orderStatusData of orderStatuses) {
                if (orderStatusData.name === statusName) {
                    return orderStatusData.id;
                }
            }
            throw new Error("Error! ");
        });
    }
    makeBaselinkerPost(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default.post('https://api.baselinker.com/connector.php', params)
                .then(res => res.data)
                .catch(error => console.log(error));
        });
    }
    createBaselinkerApiParams(method, params) {
        const urlSearchParams = new url_1.URLSearchParams({
            "token": this.apiToken,
            "method": method,
            "parameters": JSON.stringify(params)
        });
        return urlSearchParams.toString();
    }
}
exports.default = BaselinkerApiController;
