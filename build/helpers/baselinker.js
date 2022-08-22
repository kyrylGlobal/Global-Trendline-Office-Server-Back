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
exports.sendStatisticToSheet = exports.generateHeatersStatistic = exports.sliceOrders = exports.setLastGoogleSheetRowNumber = exports.getLastGoogleSheetRowNumber = exports.createValues = exports.getSattisticsByName = exports.parseWoocomersJsonOrdersToBaselinker = exports.combineStatuseByCountry = exports.filterStatusesByName = void 0;
const BaselinkerApiController_1 = __importDefault(require("../services/BaselinkerApiController"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const GoogleSheetApiController_1 = __importDefault(require("../services/GoogleSheetApiController"));
const filterStatusesByName = (statuses, regex) => statuses.filter((status) => regex.test(status.name));
exports.filterStatusesByName = filterStatusesByName;
function combineStatuseByCountry(readyStatuses, sendStatuses) {
    let combinedStatuses = {};
    if (readyStatuses.length != sendStatuses.length) {
        throw new Error("Length of ready and sent statuses is different. Please check name format of each statuses");
    }
    for (let [index, readyStatus] of readyStatuses.entries()) {
        const statusName = readyStatus.name;
        const statusCountryRegexData = statusName.match(/^Ready (\w\w)$/);
        if (statusCountryRegexData != null && statusCountryRegexData[1]) {
            let statusCountry = statusCountryRegexData[1];
            combinedStatuses[statusCountry] = {};
            combinedStatuses[statusCountry]["ready"] = readyStatus;
            // combinedStatuses[statusCountry]["sent"] = sendStatuses[index];
            sendStatuses.forEach(sendStatus => {
                if (sendStatus.name.includes(statusCountry)) {
                    combinedStatuses[statusCountry]["sent"] = sendStatus;
                }
            });
        }
    }
    return combinedStatuses;
}
exports.combineStatuseByCountry = combineStatuseByCountry;
function parseWoocomersJsonOrdersToBaselinker(woocomerceOrders, orderStatusId) {
    let baselinkerOrders = [];
    for (let woocomerceOrder of woocomerceOrders) {
        let bProducts = woocomerceOrder.products.map((product) => {
            return {
                attributes: "",
                ean: "",
                location: "",
                name: product.name,
                price_brutto: product.item_price,
                product_id: "",
                quantity: product.qty,
                sku: product.sku,
                storage: "",
                tax_rate: 0,
            };
        });
        baselinkerOrders.push({
            admin_comments: "",
            currency: woocomerceOrder.order_currency,
            custom_source_id: woocomerceOrder.order_id,
            date_add: new Date(woocomerceOrder.order_date).getTime() / 1000,
            delivery_address: woocomerceOrder.shipping_address,
            delivery_city: woocomerceOrder.shipping_city,
            delivery_company: woocomerceOrder.billing_company,
            delivery_country_code: woocomerceOrder.shipping_country,
            delivery_fullname: `${woocomerceOrder.shipping_first_name} ${woocomerceOrder.shipping_last_name}`,
            delivery_method: woocomerceOrder.shipping_method_title,
            delivery_point_address: "",
            delivery_point_city: "",
            delivery_point_id: "",
            delivery_point_name: "",
            delivery_point_postcode: "",
            delivery_postcode: woocomerceOrder.shipping_postcode,
            delivery_price: woocomerceOrder.order_shipping,
            email: woocomerceOrder.billing_email,
            extra_field_1: "",
            extra_field_2: "",
            invoice_address: woocomerceOrder.billing_address,
            invoice_city: woocomerceOrder.billing_city,
            invoice_company: woocomerceOrder.billing_company,
            invoice_country_code: woocomerceOrder.billing_country,
            invoice_fullname: `${woocomerceOrder.billing_first_name} ${woocomerceOrder.billing_last_name}`,
            invoice_nip: "",
            invoice_postcode: woocomerceOrder.billing_postcode,
            order_status_id: orderStatusId,
            paid: woocomerceOrder.paid_date === "" ? 0 : 1,
            payment_method: woocomerceOrder.payment_method_title,
            payment_method_cod: woocomerceOrder.payment_method === "cod" ? 1 : 0,
            phone: woocomerceOrder.billing_phone,
            products: bProducts,
            user_comments: "",
            user_login: "",
            want_invoice: 0
        });
    }
    console.log();
    return baselinkerOrders;
}
exports.parseWoocomersJsonOrdersToBaselinker = parseWoocomersJsonOrdersToBaselinker;
// export async function addOrdersToBaselinker() { // Add arders which does not exist in folder, getting orders from file
//     const baselinkerApiController = new BaselinkerApiController();
//     const baselinkerStatusForAdding = "Not Confirmed";
//     const baselinkerStatusForChecking = "Return by code";
//     const fileWithWoocomerceJsonData = './src/db/orders/orders.json';
//     const woocomerceOrders = JSON.parse(Files.readFileSync(fileWithWoocomerceJsonData));
//     let parsedBaselinkerOrders = parseWoocomersJsonOrdersToBaselinker(woocomerceOrders, await (baselinkerApiController.getOrderStatusIdByName(baselinkerStatusForAdding)));
//     const baselinkerOrdersFromFolder = await baselinkerApiController.getOrders({
//         statusId: await (baselinkerApiController.getOrderStatusIdByName(baselinkerStatusForChecking))
//     });
//     parsedBaselinkerOrders = parsedBaselinkerOrders.filter( order => {
//         for(let folderOrders of baselinkerOrdersFromFolder) {
//             if(folderOrders.shop_order_id.toString() === order.custom_source_id?.toString()) {
//                 return false;
//             }
//         }
//         return true;
//     })
//     baselinkerApiController.addOrders(parsedBaselinkerOrders);
// }
function getSattisticsByName(orders) {
    let statistic = {};
    let config = [
        {
            options: ["easyheater", "easyheater-1"],
            exact: true,
            officialName: "kominek"
        },
        {
            options: ["harmony"],
            exact: false,
            officialName: "harmony"
        },
        {
            options: ["dove"],
            exact: false,
            officialName: "dove"
        },
        {
            options: ["orchid"],
            exact: false,
            officialName: "orchid"
        },
        {
            options: ["waterfall"],
            exact: false,
            officialName: "waterfall"
        },
        {
            options: ["village"],
            exact: false,
            officialName: "village"
        }
    ];
    for (let order of orders) {
        let includeProduct = false;
        if (true) {
            if (order.order_id === 439316536) {
                console.log();
            }
            for (let product of order.products) {
                for (let productConfig of config) {
                    let wasFound = false;
                    if (statistic[order.delivery_country]) {
                        wasFound = addProduct(order, product, statistic, productConfig);
                    }
                    else {
                        statistic[order.delivery_country] = { products: {}, ordersWithConfigProducts: 0, orders: 0 };
                        wasFound = addProduct(order, product, statistic, productConfig);
                    }
                    if (wasFound) { // if order contain product than true and we can count orders with this product
                        includeProduct = true;
                    }
                    if (wasFound) {
                        break;
                    }
                }
            }
        }
        if (includeProduct) {
            statistic[order.delivery_country].ordersWithConfigProducts++;
        }
        statistic[order.delivery_country].orders++;
    }
    return statistic;
}
exports.getSattisticsByName = getSattisticsByName;
function addProduct(order, product, statistic, productConfig) {
    if ((statistic[order.delivery_country]).products[productConfig.officialName]) {
        if (productConfig.exact) {
            if (productConfig.options.includes(product.sku)) {
                (statistic[order.delivery_country]).products[productConfig.officialName] += product.quantity;
                return true;
            }
        }
        else {
            for (let option of productConfig.options) {
                if (product.sku.includes(option)) {
                    (statistic[order.delivery_country]).products[productConfig.officialName] += product.quantity;
                    return true;
                }
            }
        }
    }
    else {
        if (productConfig.exact) {
            if (productConfig.options.includes(product.sku)) {
                (statistic[order.delivery_country]).products[productConfig.officialName] = product.quantity;
                return true;
            }
        }
        else {
            for (let option of productConfig.options) {
                if (product.sku.includes(option)) {
                    (statistic[order.delivery_country]).products[productConfig.officialName] = product.quantity;
                    return true;
                }
            }
        }
    }
    return false;
}
function addProductWithNameChecking(order, product, statistic, productConfig, containName) {
    if (productConfig.exact) {
        if (productConfig.options.includes(product.sku)) {
            (statistic[order.delivery_country]).products[productConfig.officialName] = product.quantity;
            return true;
        }
    }
    else {
        for (let option of productConfig.options) {
            if (product.sku.includes(option)) {
                (statistic[order.delivery_country]).products[productConfig.officialName] = product.quantity;
                return true;
            }
        }
    }
}
function createValues(statistic, date) {
    const curDate = new Date();
    let contryPositions = {};
    let productPositions = {};
    let values = [[]];
    values.push([date]);
    values.push([""]);
    let countryCol = 1;
    for (let contry of Object.keys(statistic)) {
        values[2].push(contry);
        contryPositions[contry] = [2, countryCol];
        countryCol += 1;
    }
    let productRow = 3;
    for (let contry of Object.keys(statistic)) {
        for (let product of Object.keys(statistic[contry].products)) {
            if (productPositions[product]) {
                values[productPositions[product][0]][contryPositions[contry][1]] += statistic[contry].products[product];
            }
            else {
                values.push([product]);
                for (let i = 0; i < Object.keys(statistic).length; i++) {
                    values[productRow].push(0);
                }
                productPositions[product] = [productRow, 0];
                values[productPositions[product][0]][contryPositions[contry][1]] += statistic[contry].products[product];
                productRow += 1;
            }
        }
    }
    return values;
}
exports.createValues = createValues;
function getLastGoogleSheetRowNumber() {
    console.log(__dirname);
    const fileData = (0, fs_1.readFileSync)(path_1.default.resolve("src", "config", "lastRowInfo.json"), { encoding: "utf8" });
    const jsonData = JSON.parse(fileData);
    return jsonData;
}
exports.getLastGoogleSheetRowNumber = getLastGoogleSheetRowNumber;
function setLastGoogleSheetRowNumber(latestTableRowLength, curDate) {
    const fileData = (0, fs_1.readFileSync)(path_1.default.resolve("src", "config", "lastRowInfo.json"), { encoding: "utf8" });
    const jsonData = JSON.parse(fileData);
    jsonData.lastRow += latestTableRowLength;
    jsonData.lastDate = curDate;
    (0, fs_1.writeFileSync)(path_1.default.resolve("src", "config", "lastRowInfo.json"), JSON.stringify(jsonData));
}
exports.setLastGoogleSheetRowNumber = setLastGoogleSheetRowNumber;
function sliceOrders(orders, dateToo) {
    return orders.filter(order => order.date_add < dateToo);
}
exports.sliceOrders = sliceOrders;
function generateHeatersStatistic(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const baselinkerController = new BaselinkerApiController_1.default();
        let orders = yield baselinkerController.getListOfOrdersByParams(params);
        let statistic = getSattisticsByName(orders);
        return statistic;
    });
}
exports.generateHeatersStatistic = generateHeatersStatistic;
function sendStatisticToSheet(statistic, date) {
    return __awaiter(this, void 0, void 0, function* () {
        const values = createValues(statistic, date);
        const googleApi = new GoogleSheetApiController_1.default("1lMRIjyb0Qlz4BtOaf2OQWczpDN-NxEhXNHRkLMYYJDY");
        const lastRow = yield googleApi.getDataFromCell("Enter", `A1`);
        yield googleApi.addData("Enter", `A${Number.parseInt(lastRow) + 1}`, values); // add new statistic
        yield googleApi.addData("Enter", `A1`, [[Number.parseInt(lastRow) + values.length]]); // update last row info
    });
}
exports.sendStatisticToSheet = sendStatisticToSheet;
