import nodemailer, { Transport, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import fs from 'fs';
import csv from 'csv-parser'
import { on } from 'events';
import country from '../config/config';
import path from 'path';
import Files from '../utils/Files';

function timeout(ms: any) {
    return new Promise(resolve => {setTimeout(() => {resolve('');}, ms);});
}

interface Gmail {
    log: string,
    pass: string,
    from: string,
    to: string,
    title: string,
    content: string,
    imgName: string
}

export async function sendGmail(data: Gmail, transporter: Transporter, maxTryNumber: number = 2, tryCount: number = 1): Promise<boolean> {
    var mailOptions: Mail.Options = {
        from: data.from,
        to: data.to,
        subject: data.title,
        html: data.content
    }

    try {
        await timeout(1000);
        let mailSendingResult = await transporter.sendMail(mailOptions);

        if(mailSendingResult.accepted.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (e: any) {
        console.log(e);
        if(tryCount <= maxTryNumber) {
            tryCount++;
            console.log(`Try nr. ${tryCount} sending mail for ${data.to}`);
            const result = await sendGmail(data, transporter, maxTryNumber, tryCount);
            console.log("result")
            return result;
        } else {
            await timeout(10000);
            throw new Error(e.mesasge);
        }
    }
}

export async function createTransport(data: Gmail) {
    return nodemailer.createTransport({
        auth: {
            user: data.log,
            pass: data.pass
        },
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        pool: true
    })
}

interface BaselinkerMailsData {
    name: string,
    email: string,
    country: string,
    info: string
}


async function getCsvData(filePath: string): Promise<BaselinkerMailsData[]> {
    return new Promise( (resolve, reject) => {
        let rows: BaselinkerMailsData[] = [];
        fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', async (row: BaselinkerMailsData) => {
            rows.push(row);
        })
        .on('end', () => {
            resolve(rows);
        })
    })
}

function jsonData(filePath: string): any {
    let fileData = fs.readFileSync(filePath, {encoding: 'utf8'});
    return JSON.parse(fileData);
}

function cleanData(data: BaselinkerMailsData[], fRejectedMails: BaselinkerMailsData[], sendedMailsFilePath: string) {
    let cleanedData: BaselinkerMailsData[] = [];
    const fSendedMails: BaselinkerMailsData[] = JSON.parse(Files.readFileSync(sendedMailsFilePath));
    for(let dataElement of data) {
        let haveCoppy = false;
        if(!fSendedMails.find( fSendedMail => fSendedMail.email === dataElement.email) && 
        !fRejectedMails.find( fRejectedMail => fRejectedMail.email === dataElement.email)) {
            for(let cleanedDataElement of cleanedData) {
                if(cleanedDataElement.email === dataElement.email) {
                    haveCoppy = true;
                    break;
                }
            }
            if(!haveCoppy) {
                cleanedData.push(dataElement);
            }
        }
    }

    return cleanedData;
}

export async function sendMailsFromCSV(filePath: string, maxCountryMails: any, otherMaxCount: number) {
    const rejectedMailsFilePAth = path.resolve((global as any).mainFolderPath, "src", "db", "mails", "rejectedMails", "rejectedMails.json");
    const sendeMailsFilePath = path.resolve((global as any).mainFolderPath, "src", "db", "mails", "sendedMails.json");
    let fRejectedMails: any[] = JSON.parse(Files.readFileSync(rejectedMailsFilePAth));
    let rejectedMails: BaselinkerMailsData[] = []
    const mailsData = await getCsvData(filePath);
    const cleanedData = cleanData(mailsData, rejectedMails, sendeMailsFilePath);
    let countSendedMails = 0;
    let sendedMailsCount: any = {};
    let sendedMails: BaselinkerMailsData[] = [];
    let prevCountry = "";
    let transporter: any;
    for(let mailData of cleanedData) {
        const curSendeMails: number = sendedMailsCount[mailData.country] === undefined ? 0 : sendedMailsCount[mailData.country];
        if(maxCountryMails[mailData.country] === undefined || curSendeMails < maxCountryMails[mailData.country]) {
            if((maxCountryMails[mailData.country] === undefined && curSendeMails < otherMaxCount) || curSendeMails < maxCountryMails[mailData.country]) {
                for(let countryElement of country) {
                    for(let countryName of countryElement.names) {
                        let mailSended = false;
                        if(countryName === mailData.country) {
                            console.log("Start sending");
                            let rejectMailInfo = "No destination";
                            const gmailData: Gmail = {
                                log: countryElement.supportEmail.log,
                                pass: countryElement.secretCode ? countryElement.secretCode : "",
                                from: `EasyShop <${countryElement.supportEmail.log}>`,
                                to: mailData.email,
                                content: countryElement.mailText,
                                title: countryElement.productName,
                                imgName: countryElement.imgName
                            }
                            try {
                                if(prevCountry != mailData.country) {
                                    if(transporter) {
                                        (transporter as Transporter).close();
                                        await timeout(10000)
                                    }
                                    transporter = await createTransport(gmailData);
                                    prevCountry = mailData.country;
                                }

                                mailSended = await sendGmail(gmailData, transporter);
                            } catch(error: any) {
                                rejectMailInfo = error.message;
                            }
                            
                            if(mailSended) {
                                countSendedMails++;
                                sendedMailsCount[mailData.country] = sendedMailsCount[mailData.country] ? sendedMailsCount[mailData.country] + 1 : 1;
                                sendedMails.push(mailData);
                                console.log(`Mail was sended. nr. ${countSendedMails}. ${mailData.country} - ${sendedMailsCount[mailData.country]}`);
                            } else {
                                mailData.info = rejectMailInfo;
                                rejectedMails.push(mailData);
                            }
                        }
                    }
                }
            }
        }
    }
    for(let key of Object.keys(sendedMailsCount)) {
        console.log(`${key} -> ${sendedMailsCount[key]}`);
    }
    console.log(`Rejected - ${rejectedMails.length}`);
    console.log(rejectedMails.length > 0 ? JSON.stringify(rejectedMails) : "");
    if(rejectedMails.length > 0) {
        fRejectedMails = fRejectedMails.concat(rejectedMails);
        Files.writeFileSync(rejectedMailsFilePAth, JSON.stringify(fRejectedMails));
    }

    if(sendedMails.length > 0) {
        let fSendedMails: BaselinkerMailsData[] = JSON.parse(Files.readFileSync(sendeMailsFilePath));
        Files.writeFileSync(sendeMailsFilePath, JSON.stringify(fSendedMails.concat(sendedMails)))
    }
}

function sendMail(mailConfigData: Gmail) {

}