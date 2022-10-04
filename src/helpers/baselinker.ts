import internal from "stream";
import country from "../config/config";
import BaselinkerApiController, { GetOrdersParams } from "../services/BaselinkerApi";
import Files from "../utils/Files";
import {readFileSync, writeFileSync} from 'fs';
import path from "path";
import Google from "../services/GoogleSheetApiController";
import DateTime from "../utils/DateTime";

interface ProductBySku {
    options: string[],
    exact: boolean,
    officialName: string
}

interface BaselinkerOrder {
    order_status_id: number,
    custom_source_id?: number,
    date_add: number,
    currency: string,
    payment_method: string,
    payment_method_cod: number,
    paid: number,
    user_comments: string,
    admin_comments: string,
    email: string,
    phone: string,
    user_login?: string,
    delivery_method: string,
    delivery_price: number,
    delivery_fullname: string,
    delivery_company: string,
    delivery_address: string,
    delivery_postcode: string,
    delivery_city: string,
    delivery_country_code: string,
    delivery_point_id: string,
    delivery_point_name: string,
    delivery_point_address: string,
    delivery_point_postcode: string,
    delivery_point_city: string,
    invoice_fullname: string,
    invoice_company: string,
    invoice_nip: string,
    invoice_address: string,
    invoice_postcode: string,
    invoice_city: string,
    invoice_country_code: string,
    want_invoice: number,
    extra_field_1: string,
    extra_field_2: string,
    products: BaselinkerProduct[]
}

interface BaselinkerProduct {
    storage: string,
    storage_id?: number,
    product_id: string,
    variant_id?: number,
    name: string,
    sku: string,
    ean: string,
    location: string,
    warehouse_id?: number,
    attributes: string,
    price_brutto: number,
    tax_rate: number,
    quantity: number,
    weight?: number
}


export const filterStatusesByName = (statuses: any[], regex: RegExp): any => statuses.filter( (status) => regex.test(status.name));


export function combineStatuseByCountry(readyStatuses: any[], sendStatuses: any[]): any {
    let combinedStatuses: any = {}
    if(readyStatuses.length != sendStatuses.length) {
        throw new Error("Length of ready and sent statuses is different. Please check name format of each statuses");
    }

    for(let [index, readyStatus] of readyStatuses.entries()) {
        const statusName = readyStatus.name;
        const statusCountryRegexData = (statusName as string).match(/^Ready (\w\w)$/);
        if(statusCountryRegexData != null && statusCountryRegexData[1]) {
            let statusCountry = statusCountryRegexData[1];
            combinedStatuses[statusCountry] = {};
            combinedStatuses[statusCountry]["ready"] = readyStatus;
            // combinedStatuses[statusCountry]["sent"] = sendStatuses[index];
            sendStatuses.forEach( sendStatus => {
                if((sendStatus.name as string).includes(statusCountry)) {
                    combinedStatuses[statusCountry]["sent"] = sendStatus;
                }
            })
        }
    }

    return combinedStatuses;
}

export function parseWoocomersJsonOrdersToBaselinker(woocomerceOrders: any[], orderStatusId: any): BaselinkerOrder[] {
    let baselinkerOrders: BaselinkerOrder[] = [];
    for(let woocomerceOrder of woocomerceOrders) {
        let bProducts: BaselinkerProduct[] = (woocomerceOrder.products as Array<any>).map( (product: any): BaselinkerProduct => {
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
                
            }
        });

        baselinkerOrders.push({
            admin_comments: "",
            currency: woocomerceOrder.order_currency,
            custom_source_id:  woocomerceOrder.order_id,
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
        })
    }

    console.log();
    return baselinkerOrders;
}

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

export function getSattisticsByName(orders: any[]): any {
    let statistic: any = {}
    let config: ProductBySku[] = [
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
    ]
    for(let order of orders) {
        let includeProduct = false;
        if(order.products) {
            for(let product of order.products) {
                for(let productConfig of config) {
                    let wasFound = false;
                    if(statistic[order.delivery_country]) {
                        wasFound = addProduct(order, product, statistic, productConfig)
                    } else {
                        statistic[order.delivery_country] = {products: {}, ordersWithConfigProducts: 0, orders: 0};
                        wasFound = addProduct(order, product, statistic, productConfig);
                    }

                    if(wasFound) { // if order contain product than true and we can count orders with this product
                        includeProduct = true;
                        break;
                    }
                }
            }
        }
        if(includeProduct) {
            statistic[order.delivery_country].ordersWithConfigProducts++;
        }
        statistic[order.delivery_country] && statistic[order.delivery_country].orders++;
    }
    return statistic;
}

function addProduct(order: any, product: any, statistic: any, productConfig: ProductBySku): boolean {
    if((statistic[order.delivery_country]).products[productConfig.officialName]) {
        if(productConfig.exact) {
            if(productConfig.options.includes(product.sku)) {
                (statistic[order.delivery_country]).products[productConfig.officialName] += product.quantity;
                return true;
            }
        } else {
            for(let option of productConfig.options) {
                if((product.sku as string).toLowerCase().includes(option)) {
                    (statistic[order.delivery_country]).products[productConfig.officialName] += product.quantity;
                    return true;
                }
            }
        }
    } else {
        if(productConfig.exact) {
            if(productConfig.options.includes(product.sku)) {
                (statistic[order.delivery_country]).products[productConfig.officialName] = product.quantity;
                return true;
            }
        }
        else {
            for(let option of productConfig.options) {
                if((product.sku as string).toLowerCase().includes(option)) {
                    (statistic[order.delivery_country]).products[productConfig.officialName] = product.quantity;
                    return true;
                }
            }
        }
    }
    return false;
}

function addProductWithNameChecking(order: any, product: any, statistic: any, productConfig: ProductBySku, containName: boolean) {
    if(productConfig.exact) {
        if(productConfig.options.includes(product.sku)) {
            (statistic[order.delivery_country]).products[productConfig.officialName] = product.quantity;
            return true;
        }
    }
    else {
        for(let option of productConfig.options) {
            if((product.sku as Array<string>).includes(option)) {
                (statistic[order.delivery_country]).products[productConfig.officialName] = product.quantity;
                return true;
            }
        }
    }
}


export function createValues(statistic: any, date: string) {
    const curDate = new Date();
    let contryPositions: any = {};
    let productPositions: any = {};
    let values: any[] = [[]];
    values.push([date]);
    values.push([""]);
    let countryCol = 1;
    for(let contry of Object.keys(statistic)) {
        (values[2] as Array<any>).push(contry);
        contryPositions[contry] = [2,countryCol];
        countryCol += 1; 
    }
    let productRow = 3;
    for(let contry of Object.keys(statistic)) {
        for(let product of Object.keys(statistic[contry].products)) {
            if(productPositions[product]) {
                values[productPositions[product][0]][contryPositions[contry][1]] += statistic[contry].products[product];
            } else {
                values.push([product]);
                for(let i = 0; i < Object.keys(statistic).length; i++) {
                    (values[productRow] as Array<any>).push(0);
                }
                productPositions[product] = [productRow, 0];
                values[productPositions[product][0]][contryPositions[contry][1]] += statistic[contry].products[product];
                productRow += 1;
            }
        }
    }

    return values;
}

export function getLastGoogleSheetRowNumber() {
    console.log(__dirname);
    const fileData = readFileSync(path.resolve("src", "config", "lastRowInfo.json"), {encoding: "utf8"});
    const jsonData = JSON.parse(fileData);
    return jsonData;
}

export function setLastGoogleSheetRowNumber(latestTableRowLength: number, curDate: string) {
    const fileData = readFileSync(path.resolve("src", "config", "lastRowInfo.json"), {encoding: "utf8"});
    const jsonData = JSON.parse(fileData);
    jsonData.lastRow += latestTableRowLength;
    jsonData.lastDate = curDate;
    writeFileSync(path.resolve("src", "config", "lastRowInfo.json"), JSON.stringify(jsonData));
}

export function sliceOrders(orders: any[],dateToo: number): any[] {
    return orders.filter( order => order.date_add < dateToo);
}

export async function generateHeatersStatistic(params: GetOrdersParams) {
    const baselinkerController = new BaselinkerApiController();
    params.severalFolder = false; // update parameters, generally we should send it from client but for now it is okay
    let orders = await baselinkerController.getListOfOrdersByParams(params);

    let statistic = getSattisticsByName(orders);
    return statistic;
}

export async function sendStatisticToSheet(statistic: any, date: string) {
    const values = createValues(statistic, date);

    const googleApi = new Google("1lMRIjyb0Qlz4BtOaf2OQWczpDN-NxEhXNHRkLMYYJDY");
    const lastRow: string = await googleApi.getDataFromCell("Enter", `A1`);

    await googleApi.addData("Enter", `A${Number.parseInt(lastRow)+1}`, values); // add new statistic

    await googleApi.addData("Enter", `A1`, [[Number.parseInt(lastRow) + values.length]]); // update last row info
}
