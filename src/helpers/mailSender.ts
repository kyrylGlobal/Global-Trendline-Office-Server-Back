import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import fs from 'fs';
import csv from 'csv-parser'
import { on } from 'events';

interface Gmail {
    log: string,
    pass: string,
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
        from: data.log,
        to: data.to,
        subject: "Raport",
        text: data.content 
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            console.log(error);
        } else {
            console.log("Mail was succesfully sended.")
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
        sendGmail({
            log: 'kyryl.global@gmail.com',
            pass: 'Whatareyoudoingglobal03011973',
            to: row.email,
            content: `Hello ${row.name}. Just testing`
        })
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