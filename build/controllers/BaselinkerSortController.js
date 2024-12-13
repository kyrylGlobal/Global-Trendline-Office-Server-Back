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
const path_1 = __importDefault(require("path"));
const sortingConfig_1 = require("../config/sortingConfig");
const system_1 = require("../helpers/system");
const BaselinkerApi_1 = __importDefault(require("../services/BaselinkerApi"));
const Files_1 = __importDefault(require("../utils/Files"));
class BaselinkerSortController {
    sortDuplicateOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let resultMessages = [];
                const lookingStatusNames = ["Check"];
                let bApi = new BaselinkerApi_1.default();
                const lookingStatusesId = yield this.generateStatusesId(bApi, lookingStatusNames);
                const mainOrders = yield bApi.getListOfOrdersByParams({
                    statuses: lookingStatusesId,
                    severalFolder: true
                });
                resultMessages.push(yield this.resolveDuplicatesOrders(bApi, mainOrders));
                res.status(200).send(JSON.stringify(resultMessages));
                this.logCompleatedInfo(resultMessages);
            }
            catch (e) {
                res.status(500).send(e.message);
            }
        });
    }
    updateOrdersData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultMessages = [];
            const lookingStatusNames = ["Priority", "Check", "Delayed Del. 2", "Delayed Delivery", "Express", "Preparation"];
            let bApi = new BaselinkerApi_1.default();
            const lookingStatusesId = yield this.generateStatusesId(bApi, lookingStatusNames);
            const mainOrders = yield bApi.getListOfOrdersByParams({
                statuses: lookingStatusesId,
                severalFolder: true
            });
            resultMessages.push(yield this.updatePresentsSku(bApi, mainOrders));
            res.status(200).send(JSON.stringify(resultMessages));
            this.logCompleatedInfo(resultMessages);
        });
    }
    resolveDuplicatesOrders(bApi, mainOrders) {
        return __awaiter(this, void 0, void 0, function* () {
            const samePersonOrdersSets = this.generateOrdersSetsWithSamePersons(mainOrders);
            return yield this.resolveSimilarOrdersSets(samePersonOrdersSets, bApi);
        });
    }
    resolveSimilarOrdersSets(ordersSets, bApi) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let ordersSet of ordersSets) {
                yield this.resolveSetWithSendedOrders(ordersSet, bApi); // for now just remove strange orders(not "Delayed delivery",...)
                yield this.checkForPayment(ordersSet, bApi);
            }
            return "";
        });
    }
    checkForPayment(ordersSet, bApi) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ordersSet.length > 0) {
                let sortedOrdersByDateDesc = this.sortOrdersByDateDesc(ordersSet);
            }
        });
    }
    sortOrdersByDateDesc(ordersSet) {
        return ordersSet.sort((first, next) => {
            if (first.date_add > next.date_add) {
                return -1;
            }
            else if (next.date_add > first.date_add) {
                return 1;
            }
            return 0;
        });
    }
    resolveSetWithSendedOrders(ordersSet, bApi) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkStatuses(ordersSet, bApi);
        });
    }
    checkStatuses(ordersSet, bApi) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkUnsendedStatuses(ordersSet, bApi);
        });
    }
    checkUnsendedStatuses(ordersSet, bApi) {
        return __awaiter(this, void 0, void 0, function* () {
            const noneSendedSatusesId = yield this.generateStatusesId(bApi, [
                "Check", "Delayed Del. 2", "Delayed Delivery", "Express", "New Orders", "Wrong orders", "Priority"
            ]);
            for (let order of ordersSet) {
                if (!noneSendedSatusesId.includes(order.order_status_id)) {
                    // console.log(`Removed orders ${ordersSet.map( order => order.order_id)}`)
                    ordersSet.splice(0, ordersSet.length);
                    break;
                }
            }
        });
    }
    generateOrdersSetsWithSamePersons(mainOrders) {
        const periodOrders = this.getOrdersFromFolder(); // pre loaded orders. Before it use api/baselinker/sorting/updateFile
        let ordersSets = [];
        mainOrders.forEach((mainOrder) => {
            if ((mainOrder === null || mainOrder === void 0 ? void 0 : mainOrder.usable) != true) {
                let ordersSet = [];
                periodOrders.forEach((periodOrder, periodOrderIndex) => {
                    if (mainOrder.order_id === 457204263 && periodOrder.order_id === 457204261) {
                        console.log();
                    }
                    if ((periodOrder === null || periodOrder === void 0 ? void 0 : periodOrder.usable) != true) {
                        if (mainOrder.order_id != periodOrder.order_id) {
                            if (this.areOrdersFromSamePerson(mainOrder, periodOrder)) {
                                ordersSet.push(periodOrder);
                                periodOrder.usable = true;
                                this.updateIfMainOrdersContainOrder(mainOrders, periodOrder);
                            }
                        }
                    }
                });
                if (ordersSet.length > 0) {
                    ordersSet.push(mainOrder);
                    ordersSets.push(ordersSet);
                }
            }
        });
        return ordersSets;
    }
    updateIfMainOrdersContainOrder(mainOrders, order) {
        for (let mainOrder of mainOrders) {
            if (mainOrder.order_id === order.order_id) {
                mainOrder.usable = true;
            }
        }
    }
    areOrdersFromSamePerson(mainOrder, periodOrder) {
        if (mainOrder.delivery_country_code === periodOrder.delivery_country_code) {
            if (mainOrder.email === periodOrder.email && mainOrder.phone === periodOrder.phone) {
                return true;
            }
        }
        return false;
    }
    updatePresentsSku(bApi, mainOredrs) {
        return __awaiter(this, void 0, void 0, function* () {
            const presentSku = "present";
            let updatedProducts = 0;
            for (let order of mainOredrs) {
                let orderCCode = order.delivery_country_code.toLowerCase(); // order country code
                for (let product of order.products) {
                    if (sortingConfig_1.PRESENTSNAMES[orderCCode] && product.name.includes(sortingConfig_1.PRESENTSNAMES[orderCCode])) {
                        if (product.sku != presentSku) {
                            let result = yield bApi.setOrdersProductFields({
                                "order_id": order.order_id,
                                "order_product_id": product.order_product_id,
                                "sku": "present"
                            });
                            if (result.status === "SUCCESS") {
                                console.log(`${result.status}! ${order.order_id} sku was updated to ${presentSku}.`);
                                updatedProducts++;
                            }
                            else {
                                console.log(`${result.status}! ${result.error_message}`);
                            }
                            yield (0, system_1.whait)(700); // baselinker can resive only 100 request per minute, with this delllay it should work :)
                        }
                    }
                }
            }
            return `Products updated - ${updatedProducts}.`;
        });
    }
    logCompleatedInfo(information) {
        information.forEach(info => {
            console.log(info);
        });
        console.log("Compleated :)");
    }
    generateStatusesId(bApi, statusesNames) {
        return __awaiter(this, void 0, void 0, function* () {
            let statuses = yield bApi.getListOfStatuses();
            const statusesIds = statusesNames.map((lStatusName) => {
                try {
                    const statusId = statuses.find((status) => status.name === lStatusName).id;
                    return statusId;
                }
                catch (e) {
                    throw new Error(`Error! Can not find id for "${lStatusName}" status name.`);
                }
            });
            return statusesIds;
        });
    }
    createDateUnix(daysBack, mounthBack) {
        let date = new Date();
        date.setMonth(date.getMonth() - mounthBack);
        date.setDate(date.getDate() - daysBack);
        date.setHours(0, 0, 0, 0);
        let dateUnix = Math.floor(date.getTime() / 1000);
        return dateUnix;
    }
    updateFileWithPeriodOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let bApi = new BaselinkerApi_1.default();
            let dateUnix = this.createDateUnix(0, 2);
            const selectedTimeOrders = yield bApi.getListOfOrdersByParams({
                dateFrom: dateUnix,
                severalFolder: false
            });
            try {
                Files_1.default.writeFileSync(this.getOrdersFilePath(), JSON.stringify(selectedTimeOrders));
                res.status(200).send(`File was succesfully updated with ${selectedTimeOrders.length} orders`);
            }
            catch (e) {
                res.status(500).send(e.message);
            }
        });
    }
    getOrdersFromFolder() {
        const ordersString = Files_1.default.readFileSync(this.getOrdersFilePath());
        return JSON.parse(ordersString);
    }
    getOrdersFilePath() { return path_1.default.resolve(global.mainFolderPath, "public", "documents", "json", "orders.json"); }
}
exports.default = new BaselinkerSortController();
