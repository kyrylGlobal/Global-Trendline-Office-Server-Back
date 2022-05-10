import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import fs from 'fs';
import csv from 'csv-parser'
import { on } from 'events';
import country from '../config/config';

interface Gmail {
    log: string,
    pass: string,
    from: string,
    to: string,
    title: string,
    content: string
}

export function sendGmail(data: Gmail) {
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
        text: data.content 
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            console.log(error);
        } else {
            console.log(`Mail from ${data.log} was succesfully sended.`);
        }
    })
}

interface BaselinkerMailsData {
    name: string,
    email: string,
    country: string
}

export function sendMailsFromCSV(filePath: string) {
    fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row: BaselinkerMailsData) => {
        let countryWasFounded = false;
        for(let contryElement of country) {
            for(let countryName of contryElement.names) {
                if(countryName === row.country) {
                    countryWasFounded = true;
                    if(true) {
                        sendGmail({
                            log: contryElement.supportEmail.log,
                            pass: contryElement.supportEmail.pas,
                            from: `EasyShop <${contryElement.supportEmail.log}>`,
                            to: row.email,
                            content: `${row.name}, ${contryElement.mailText}`,
                            title: contryElement.productName
                        })
                    }
                }

                if(countryWasFounded) {
                    break;
                }
            }

            if(countryWasFounded) {
                break;
            }
        }
    })
    .on('end', () => {
        console.log('Done reading!')
    })
}


//
//asparagussgreen@gmail.com
//kyrylpopyk@gmail.com
//kyrylpopyk1@gmail.com
//kyrylpopyk2@gmail.com
//popykmaksym15@gmail.com
//sveto4kaaa0312@gmail.com