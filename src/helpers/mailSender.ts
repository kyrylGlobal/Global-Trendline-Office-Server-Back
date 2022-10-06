import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import fs from 'fs';
import csv from 'csv-parser'
import { on } from 'events';
import country from '../config/config';
import path from 'path';

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
            user: data.log,
            pass: data.pass
        }
    })

    var mailOptions: Mail.Options = {
        from: data.from,
        to: data.to,
        subject: data.title,
        text: data.content,
        html: `<div style='display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 10vh 10vh 20vh 40vh 10vh;
        width: 80%;
        margin: auto;
        text-align: center;'>
            <h1>Привет кто то там</h1>
            <p>Предлашаем вам сделать видео а мы вам на шару дадим что-то там...</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam voluptatum laudantium mollitia, tenetur ut officiis ad quos ea dolor neque porro numquam maiores quidem eveniet consectetur alias eligendi libero amet?</p>
            <img style='max-height: 100%; margin: auto;' src='cid:logo'>
            <p style='align-self: center; text-align: start;'>С уважение Easyshop</p>
        </div>`,
        attachments: [{
            filename: "Sharingan",
            path: path.resolve((global as any).mainFolderPath, "public", "easyheater.jpg"),
            cid: "logo"
        }]
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

function jsonData(filePath: string): any {
    let fileData = fs.readFileSync(filePath, {encoding: 'utf8'});
    return JSON.parse(fileData);
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
    let rejectedMails: BaselinkerMailsData[] = []
    const mailsData = await getCsvData(filePath);
    const cleanedData = cleanData(mailsData);
    let countSendedMails = 0;
    let sendedMailsCount: any = {};
    for(let mailData of mailsData) {
        for(let countryElement of country) {
            for(let countryName of countryElement.names) {
                let mailSended = false;
                if(countryName === mailData.country) {
                    await timeout(500);
                    console.log("Start sending");
                    try {
                        mailSended = await sendGmail({
                            log: countryElement.supportEmail.log,
                            pass: countryElement.supportEmail.pas,
                            from: `EasyShop <${countryElement.supportEmail.log}>`,
                            to: mailData.email,
                            content: "<h1>Hello Kyryl</h1>",
                            title: countryElement.productName,
                        })
                    } catch(error: any) {
                        console.log("Failed sending");
                        console.log(error.message);
                    }
                    
                    if(mailSended) {
                        countSendedMails++;
                        console.log(`Mail was sended. nr. ${countSendedMails}`);
                        sendedMailsCount[mailData.country] = sendedMailsCount[mailData.country] ? sendedMailsCount[mailData.country] + 1 : 1;
                    } else {
                        rejectedMails.push(mailData);
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
}