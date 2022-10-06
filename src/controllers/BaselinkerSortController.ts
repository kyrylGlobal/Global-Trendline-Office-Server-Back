import { Request, Response, NextFunction } from "express";
import path from "path";
import { PRESENTSNAMES } from "../config/sortingConfig";
import { whait } from "../helpers/system";
import BaselinkerApiController from "../services/BaselinkerApi";
import Files from "../utils/Files";

interface CompareOrderResult {
    orderIdToSave: number,
    orderIdDuplicate: number,
    info: string
}

class BaselinkerSortController {

    public async sortDuplicateOrders(req: Request, res: Response, next: NextFunction) {
        try {
            let resultMessages: string[] = [];
            const lookingStatusNames = ["Check"];
            let bApi = new BaselinkerApiController();
            const lookingStatusesId: number[] = await this.generateStatusesId(bApi, lookingStatusNames);
            const mainOrders = await bApi.getListOfOrdersByParams({
                statuses: lookingStatusesId,
                severalFolder: true
            })

            resultMessages.push(await this.resolveDuplicatesOrders(bApi, mainOrders));
            res.status(200).send(JSON.stringify(resultMessages));
            this.logCompleatedInfo(resultMessages);
        } catch(e: any) {
            res.status(500).send(e.message);
        }
    }

    public async updateOrdersData(req: Request, res: Response, next: NextFunction) {
        let resultMessages: string[] = [];
            const lookingStatusNames = ["Priority", "Check", "Delayed Del. 2", "Delayed Delivery", "Express", "Preparation"];
            let bApi = new BaselinkerApiController();
            const lookingStatusesId: number[] = await this.generateStatusesId(bApi, lookingStatusNames);
            const mainOrders = await bApi.getListOfOrdersByParams({
                statuses: lookingStatusesId,
                severalFolder: true
            })

            resultMessages.push(await this.updatePresentsSku(bApi, mainOrders));
            res.status(200).send(JSON.stringify(resultMessages));
            this.logCompleatedInfo(resultMessages);
    }

    private async resolveDuplicatesOrders(bApi: BaselinkerApiController, mainOrders: any[]): Promise<string> {
        const samePersonOrdersSets = this.generateOrdersSetsWithSamePersons(mainOrders);
        return await this.resolveSimilarOrdersSets(samePersonOrdersSets, bApi);
    }

    private async resolveSimilarOrdersSets(ordersSets: any[], bApi: BaselinkerApiController): Promise<string> {
        for(let ordersSet of ordersSets) {
            await this.resolveSetWithSendedOrders(ordersSet, bApi); // for now just remove strange orders(not "Delayed delivery",...)
            await this.checkForPayment(ordersSet, bApi);
        }

        return "";
    }

    private async checkForPayment(ordersSet: any[], bApi: BaselinkerApiController) {
        if(ordersSet.length > 0) {
            let sortedOrdersByDateDesc = this.sortOrdersByDateDesc(ordersSet);
        }
    }

    private sortOrdersByDateDesc(ordersSet: any[]) {
        return ordersSet.sort((first, next) => {
            if(first.date_add > next.date_add) {
                return -1;
            } else if(next.date_add > first.date_add) {
                return 1;
            }

            return 0;
        })
    }

    private async resolveSetWithSendedOrders(ordersSet: any[], bApi: BaselinkerApiController) {
        await this.checkStatuses(ordersSet, bApi)
    }

    private async checkStatuses(ordersSet: any[], bApi: BaselinkerApiController) {
        await this.checkUnsendedStatuses(ordersSet, bApi);
    }

    private async checkUnsendedStatuses(ordersSet: any[], bApi: BaselinkerApiController) { // also do not iclude Priority --- TO DO
        const noneSendedSatusesId: number[] = await this.generateStatusesId(bApi, [
            "Check", "Delayed Del. 2", "Delayed Delivery", "Express", "New Orders", "Wrong orders", "Priority"
        ]);
        for(let order of ordersSet) {
            if(!noneSendedSatusesId.includes(order.order_status_id)) {
                // console.log(`Removed orders ${ordersSet.map( order => order.order_id)}`)
                ordersSet.splice(0, ordersSet.length);
                break;
            }
        }
    }

    private generateOrdersSetsWithSamePersons(mainOrders: any[]): any[] {
        const periodOrders = this.getOrdersFromFolder(); // pre loaded orders. Before it use api/baselinker/sorting/updateFile
        let ordersSets: any[] = [];
        mainOrders.forEach( (mainOrder) => {
            if(mainOrder?.usable != true) {
                let ordersSet: any[] = [];
                periodOrders.forEach( (periodOrder, periodOrderIndex) => {
                    if(mainOrder.order_id === 457204263 && periodOrder.order_id === 457204261) {
                        console.log();
                    }
                    if(periodOrder?.usable != true) {
                        if(mainOrder.order_id != periodOrder.order_id) {
                            if(this.areOrdersFromSamePerson(mainOrder, periodOrder)) {
                                ordersSet.push(periodOrder);
                                periodOrder.usable = true;
                                this.updateIfMainOrdersContainOrder(mainOrders, periodOrder);
                            }
                        }
                    }
                })

                if(ordersSet.length > 0) {
                    ordersSet.push(mainOrder);
                    ordersSets.push(ordersSet);   
                }
            }
        })
        return ordersSets;
    }

    private updateIfMainOrdersContainOrder(mainOrders: any[], order: any) {
        for(let mainOrder of mainOrders) {
            if(mainOrder.order_id === order.order_id) {
                mainOrder.usable = true;
            }
        }
    }

    private areOrdersFromSamePerson (mainOrder: any, periodOrder: any): boolean {
        if(mainOrder.delivery_country_code === periodOrder.delivery_country_code) {
            if(mainOrder.email === periodOrder.email && mainOrder.phone === periodOrder.phone) {
                return true;
            }
        }
        return false;
    }

    private async updatePresentsSku(bApi: BaselinkerApiController, mainOredrs: any[]): Promise<string> {
        const presentSku = "present";
        let updatedProducts = 0;
        for(let order of mainOredrs) {
            let orderCCode = (order.delivery_country_code as string).toLowerCase(); // order country code
            for(let product of order.products) {
                if(PRESENTSNAMES[orderCCode] && (product.name as string).includes(PRESENTSNAMES[orderCCode])) {
                    if(product.sku != presentSku) {
                        let result = await bApi.setOrdersProductFields({
                            "order_id": order.order_id,
                            "order_product_id": product.order_product_id,
                            "sku": "present"
                        })
                        if(result.status === "SUCCESS") {
                            console.log(`${result.status}! ${order.order_id} sku was updated to ${presentSku}.`);
                            updatedProducts++;
                        } else {
                            console.log(`${result.status}! ${result.error_message}`);
                        }
                        await whait(700); // baselinker can resive only 100 request per minute, with this delllay it should work :)
                    }
                }
            }
        }

        return `Products updated - ${updatedProducts}.`;
    }

    private logCompleatedInfo(information: string[]) {
        information.forEach( info => {
            console.log(info);
        })
        console.log("Compleated :)");
    }

    private async generateStatusesId(bApi: BaselinkerApiController, statusesNames: string[]): Promise<number[]> {
        let statuses = await bApi.getListOfStatuses();
        const statusesIds = statusesNames.map( (lStatusName: string) => {
            try {
                const statusId = statuses.find( (status) => status.name === lStatusName).id as number;
                return statusId;
            } catch(e: any) {
                throw new Error(`Error! Can not find id for "${lStatusName}" status name.`);
            }
        })
        return statusesIds;
    }

    private createDateUnix(daysBack: number, mounthBack: number): number { // more like for testing
        let date = new Date();
        date.setMonth(date.getMonth() - mounthBack);
        date.setDate(date.getDate() - daysBack)
        date.setHours(0,0,0,0);
        let dateUnix = Math.floor(date.getTime() / 1000);
        return dateUnix;
    }

    public async updateFileWithPeriodOrders(req: Request, res: Response, next: NextFunction) { // testing
        let bApi = new BaselinkerApiController();
        let dateUnix = this.createDateUnix(0, 2);
        const selectedTimeOrders = await bApi.getListOfOrdersByParams({
            dateFrom: dateUnix,
            severalFolder: false
        })
        try{
            Files.writeFileSync(this.getOrdersFilePath(), JSON.stringify(selectedTimeOrders));
            res.status(200).send(`File was succesfully updated with ${selectedTimeOrders.length} orders`);
        }
        catch(e: any) {
            res.status(500).send(e.message);
        }
    }

    private getOrdersFromFolder(): any[] {
        const ordersString = Files.readFileSync(this.getOrdersFilePath());
        return JSON.parse(ordersString);
    }

    private getOrdersFilePath(): string {return path.resolve((global as any).mainFolderPath, "public", "documents", "json", "orders.json");}
}

export default new BaselinkerSortController();