import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import fs from 'fs';
import csv from 'csv-parser'
import { on } from 'events';
import country from '../config/config';

function timeout(ms: any) {
    return new Promise(resolve => {setTimeout(() => {resolve('');}, ms);});
}

interface Gmail {
    log: string,
    pass: string,
    from: string,
    to: string,
    title: string,
    content: string
}

export async function sendGmail(data: Gmail) {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "kyryl.global@gmail.com",//data.log,
            pass: "Whatareyoudoingglobal03011973"//data.pass
        }
    })

    var mailOptions: Mail.Options = {
        from: data.from,
        to: data.to,
        subject: data.title,
        text: data.content 
    }

    let mailSendingResult = await transporter.sendMail(mailOptions);

    if(mailSendingResult.accepted.length > 0) {
        return true;
    } else {
        return false;
    }
}

interface BaselinkerMailsData {
    name: string,
    email: string,
    country: string
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

function cleanData(data: BaselinkerMailsData[]) {
    let cleanedData: BaselinkerMailsData[] = [];

    for(let dataElement of data) {
        let haveCoppy = false;
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

    return cleanedData;
}

export async function sendMailsFromCSV(filePath: string) {

    const mailsData = await getCsvData(filePath);
    const cleanedData = cleanData(mailsData);
    let countSendedMails = 0;
    let sendedMailsCount: any = {};
    for(let mailData of cleanedData) {
        for(let countryElement of country) {
            for(let countryName of countryElement.names) {
                if(countryName === mailData.country) {
                    await timeout(150);
                    console.log("Start sending");
                    let mailSended = await sendGmail({
                        log: countryElement.supportEmail.log,
                        pass: countryElement.supportEmail.pas,
                        from: `EasyShop <${countryElement.supportEmail.log}>`,
                        to: mailData.email,
                        content: `${mailData.name}, ${countryElement.mailText}`,
                        title: countryElement.productName
                    })
                    
                    if(mailSended) {
                        countSendedMails++;
                        console.log(`Mail was sended. nr. ${countSendedMails}`);
                        sendedMailsCount[mailData.country] = sendedMailsCount[mailData.country] ? sendedMailsCount[mailData.country] + 1 : 1;
                    }
                }
            }
        }
    }
    console.log(sendedMailsCount);
}