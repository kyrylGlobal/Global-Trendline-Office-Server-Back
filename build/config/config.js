"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCountryObjectIfName = exports.ifContainCountryName = exports.ErrorTypes = void 0;
const jsvat_1 = require("jsvat");
var ErrorTypes;
(function (ErrorTypes) {
    ErrorTypes["CURENCYERROR"] = "CURENCYERROR";
})(ErrorTypes = exports.ErrorTypes || (exports.ErrorTypes = {}));
const country = [
    {
        names: ["Polska", "Poland"],
        shortName: "PL",
        viesConfig: jsvat_1.poland,
        currency: "PLN",
        supportEmail: {
            log: "easyshopzakaz@gmail.com",
            pas: "",
            allowMailSending: true
        },
        productName: "Grzejnik na podczerwień „EasyHeater” za darmo!",
        mailText: `<div style='display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 10vh 10vh 20vh 40vh 10vh;
        width: 90%;
        margin: auto;
        text-align: center; border-radius: 5px; box-shadow: 0 0 10px black;'>
            <h1>Grzejnik na podczerwień „EasyHeater” za darmo!</h1>
            <p style="font-weight: bold">Żeby otrzymać „EasyHeater” w gratisie, musisz po prostu nagrać filmik z grzejnikiem który już kupiłeś.</p>
            <p style="font-weight: bold">Chcesz skorzystać z tej oferty? Napisz do nas!</p>
            <img style='max-height: 100%; margin: auto; border-radius: 5px;' src='http://drive.google.com/uc?export=view&id=1HM2AuTU4BKl2cwbk0924R_vJVYshobgO'>
            <p style='align-self: center; text-align: start; font-weight: bold; font-size: 16px;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "",
        secretCode: "lgrfaghkmwbmzjzw",
        imgName: "easyheaterPl.jpeg",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [
            { keyWord: "Za pobraniem INPOST", changeTo: "Za pobraniem INPOST" },
            { keyWord: "STRIPE", changeTo: "Stripe" },
            { keyWord: "Przesyłka za pobrani", changeTo: "GLS za pobraniem" },
            { keyWord: "PAYPAL", changeTo: "PayPal" },
            { keyWord: "Dotpay", changeTo: "PayPro" },
            { keyWord: "PayU", changeTo: "PayU" },
            { keyWord: "Przelewy24", changeTo: "PayPro" },
            { keyWord: 'pobranie', changeTo: 'GLS za pobraniem' },
            { keyWord: 'GLS za pobraniem', changeTo: 'GLS za pobraniem' },
            { keyWord: 'PayPro', changeTo: 'PayPro' },
            { keyWord: 'Przelew', changeTo: 'Przelew' },
            { keyWord: 'cash', changeTo: 'GLS za pobraniem' },
            { keyWord: 'Płatność przy odbior', changeTo: 'PRAGMAGO' },
            { keyWord: 'Klarna', changeTo: 'Klarna' }
        ]
    },
    {
        names: ["Czechy", "Czech Republic"],
        shortName: "CZ",
        viesConfig: jsvat_1.czechRepublic,
        currency: "CZK",
        supportEmail: {
            log: "sk.easyshop.info@gmail.com",
            pas: "czeasy2020",
            allowMailSending: true
        },
        productName: `Infrazářič "EasyHeater" zdarma!`,
        mailText: `<div style='display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 10vh 10vh 20vh 40vh 10vh;
        width: 90%;
        margin: auto;
        text-align: center; border-radius: 5px; box-shadow: 0 0 10px black;'>
            <h1>Infrazářič "EasyHeater" zdarma!</h1>
            <p style="font-weight: bold">Chcete-li získat ohřívač "EasyHeater" zdarma, stačí natočit video s již zakoupeným ohřívačem.</p>
            <p style="font-weight: bold">Chcete tuto nabídku využít? Napište nám!</p>
            <img style='max-height: 100%; margin: auto; border-radius: 5px;' src='http://drive.google.com/uc?export=view&id=1xtIG0BNgKxZkYIgOM9IDYGiMHa-Pg-Wz'>
            <p style='align-self: center; text-align: start; font-weight: bold; font-size: 16px;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/czk",
        secretCode: "mrbwhoqphobebyhi",
        imgName: "easyheaterSK.jpeg",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [
            { keyWord: 'pobranie', changeTo: 'Paxy za pobraniem' },
            { keyWord: "STRIPE", changeTo: "Stripe" },
            { keyWord: "PAYPAL", changeTo: "PayPal" },
            { keyWord: 'Dobírkou', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'Paxy za pobraniem', changeTo: 'Paxy za pobraniem' },
            { keyWord: "PayU", changeTo: "PayU" },
            { keyWord: "Płatność przy odbior", changeTo: "PRAGMAGO" },
            { keyWord: "Przelew", changeTo: "Przelew" },
            { keyWord: "PayPro", changeTo: "PayPro" },
        ]
    },
    {
        names: ["Węgry", "Hungary"],
        shortName: "HU",
        viesConfig: jsvat_1.hungary,
        currency: "HUF",
        supportEmail: {
            log: "hu.easyshop@gmail.com",
            pas: "Globalhu1609",
            allowMailSending: true
        },
        productName: `Infravörös fűtés "EasyHeater" ingyen!`,
        mailText: `<div style='display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 10vh 10vh 20vh 40vh 10vh;
        width: 90%;
        margin: auto;
        text-align: center; border-radius: 5px; box-shadow: 0 0 10px black;'>
            <h1>Infravörös fűtés "EasyHeater" ingyen!</h1>
            <p style="font-weight: bold">Ahhoz, hogy ingyenesen megkapja az "EasyHeater", egyszerűen csak egy videót kell készítenie a már megvásárolt fűtőberendezéssel.</p>
            <p style="font-weight: bold">Szeretne élni ezzel az ajánlattal? Írjon nekünk!</p>
            <img style='max-height: 100%; margin: auto; border-radius: 5px;' src='http://drive.google.com/uc?export=view&id=1Ce0KZp3NU51acrTrVYJEfJrT43Wxsp0k'>
            <p style='align-self: center; text-align: start; font-weight: bold; font-size: 16px;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/huf",
        secretCode: "rqvsawadsxtiragt",
        imgName: "easyheaterHU.jpeg",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [
            { keyWord: 'pobranie', changeTo: 'Paxy za pobraniem' },
            { keyWord: "STRIPE", changeTo: "Stripe" },
            { keyWord: "PAYPAL", changeTo: "PayPal" },
            { keyWord: 'Utánvétes fizetés', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'Paxy za pobraniem', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'cash', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'Przelew', changeTo: 'Przelew' },
            { keyWord: 'MasterCard ending in', changeTo: 'Stripe' },
            { keyWord: "PayU", changeTo: "PayU" },
        ]
    },
    {
        names: ["Rumunia", "Romania"],
        shortName: "RO",
        viesConfig: jsvat_1.romania,
        currency: "RON",
        supportEmail: {
            log: "ro.easyshop@gmail.com",
            pas: "",
            allowMailSending: true
        },
        productName: `Încălzitor cu infraroșu "EasyHeater" gratuit!`,
        mailText: `<div style='display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 10vh 10vh 20vh 40vh 10vh;
        width: 90%;
        margin: auto;
        text-align: center; border-radius: 5px; box-shadow: 0 0 10px black;'>
            <h1>Încălzitor cu infraroșu "EasyHeater" gratuit!</h1>
            <p style="font-weight: bold">Pentru a primi gratuit "EasyHeater", trebuie doar să realizați un videoclip cu aparatul de încălzire pe care l-ați cumpărat deja.</p>
            <p style="font-weight: bold">Doriți să profitați de această ofertă? Scrieți-ne!</p>
            <img style='max-height: 100%; margin: auto; border-radius: 5px;' src='http://drive.google.com/uc?export=view&id=1XMPdTQzgloSgCRn06brBmWH7XDZv7Fcb'>
            <p style='align-self: center; text-align: start; font-weight: bold; font-size: 16px;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/ron",
        secretCode: "gnttqpvzprzrlvjg",
        imgName: "easyheaterRO.jpeg",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [
            { keyWord: "STRIPE", changeTo: "Stripe" },
            { keyWord: "PAYPAL", changeTo: "PayPal" },
            { keyWord: 'Plata ramburs', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'Paxy za pobraniem', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'Przelew', changeTo: 'Przelew' },
            { keyWord: 'Joom Online', changeTo: 'Joom Online' }
        ]
    },
    {
        names: ["Słowacja", "Slovakia"],
        shortName: "SK",
        viesConfig: jsvat_1.slovakiaRepublic,
        currency: "EUR",
        supportEmail: {
            log: "sk.easyshop.info@gmail.com",
            pas: "Globalsk",
            allowMailSending: true
        },
        productName: `Infrazářič "EasyHeater" zdarma!`,
        mailText: `<div style='display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 10vh 10vh 20vh 40vh 10vh; 
        width: 90%;
        margin: auto;
        text-align: center; border-radius: 5px; box-shadow: 0 0 10px black;'>
            <h1>Infrazářič "EasyHeater" zdarma!</h1>
            <p style="font-weight: bold">Chcete-li získat ohřívač "EasyHeater" zdarma, stačí natočit video s již zakoupeným ohřívačem.</p>
            <p style="font-weight: bold">Chcete tuto nabídku využít? Napište nám!</p>
            <img style='max-height: 100%; margin: auto; border-radius: 5px;' src='http://drive.google.com/uc?export=view&id=1xtIG0BNgKxZkYIgOM9IDYGiMHa-Pg-Wz'>
            <p style='align-self: center; text-align: start; font-weight: bold; font-size: 16px;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "mrbwhoqphobebyhi",
        imgName: "easyheaterSK.jpeg",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [
            { keyWord: "STRIPE", changeTo: "Stripe" },
            { keyWord: "PAYPAL", changeTo: "PayPal" },
            { keyWord: 'Dobírkou', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'Paxy za pobraniem', changeTo: 'Paxy za pobraniem' },
            { keyWord: "PayU", changeTo: "PayU" },
        ]
    },
    {
        names: ["Bułgaria", "Bulgaria"],
        shortName: "BG",
        viesConfig: jsvat_1.bulgaria,
        currency: "BGN",
        supportEmail: {
            log: "bg.easyshop.info@gmail.com",
            pas: "Globalbg",
            allowMailSending: true
        },
        productName: `Инфрачервен нагревател "EasyHeater" безплатно!`,
        mailText: `<div style='display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 10vh 10vh 20vh 40vh 10vh;
        width: 90%;
        margin: auto;
        text-align: center; border-radius: 5px; box-shadow: 0 0 10px black;'>
            <h1>Инфрачервен нагревател "EasyHeater" безплатно!</h1>
            <p style="font-weight: bold">За да получите безплатно "EasyHeater", просто трябва да направите видеоклип с вече закупения отоплителен уред.</p>
            <p style="font-weight: bold">Искате ли да се възползвате от тази оферта? Пишете ни!</p>
            <img style='max-height: 100%; margin: auto; border-radius: 5px;' src='http://drive.google.com/uc?export=view&id=1-XXaKfWfiQXZmsbOXO_BUtSKLTNFYEiQ'>
            <p style='align-self: center; text-align: start; font-weight: bold; font-size: 16px;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/bgn",
        secretCode: "aavhgagilndtyapb",
        imgName: "easyheaterBG.jpeg",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [
            { keyWord: "STRIPE", changeTo: "Stripe" },
            { keyWord: "PAYPAL", changeTo: "PayPal" },
            { keyWord: 'наложен', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'Paxy za pobraniem', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'Za pobraniem', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'Przelew', changeTo: 'Przelew' }
        ]
    },
    {
        names: ["Litwa", "Lithuania"],
        shortName: "LT",
        viesConfig: jsvat_1.lithuania,
        currency: "EUR",
        supportEmail: {
            log: "lt.easyshop.info@gmail.com",
            pas: "Globallt2021",
            allowMailSending: true
        },
        productName: `Infraraudonųjų spindulių šildytuvas "EasyHeater" nemokamai!`,
        mailText: `<div style='display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 10vh 10vh 20vh 40vh 10vh;
        width: 90%;
        margin: auto;
        text-align: center; border-radius: 5px; box-shadow: 0 0 10px black;'>
            <h1>Infraraudonųjų spindulių šildytuvas "EasyHeater" nemokamai!</h1>
            <p style="font-weight: bold">Norėdami nemokamai gauti "EasyHeater", tiesiog turite nufilmuoti vaizdo įrašą su jau įsigytu šildytuvu.</p>
            <p style="font-weight: bold">Ar norėtumėte pasinaudoti šiuo pasiūlymu? Rašykite mums!</p>
            <img style='max-height: 100%; margin: auto; border-radius: 5px;' src='http://drive.google.com/uc?export=view&id=1iTASjb8rhbvvefqiKwMc4qATXMXHbcbE'>
            <p style='align-self: center; text-align: start; font-weight: bold; font-size: 16px;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "bgauhlcgtchidhfq",
        imgName: "easyheaterLT.jpeg",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [
            { keyWord: "STRIPE", changeTo: "Stripe" },
            { keyWord: "PAYPAL", changeTo: "PayPal" },
            { keyWord: 'Grynaisiais pinigais', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'Paxy za pobraniem', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'Za pobraniem', changeTo: 'Paxy za pobraniem' },
            { keyWord: "PayU", changeTo: "PayU" },
            { keyWord: "Przelew własny", changeTo: "Przelew własny" }
        ]
    },
    {
        names: ["Austria"],
        shortName: "AT",
        viesConfig: jsvat_1.austria,
        currency: "EUR",
        supportEmail: {
            log: "at.easyshop.info@gmail.com",
            pas: "Globalat2021",
            allowMailSending: true
        },
        productName: `Infrarotheizung "EasyHeater" kostenlos!`,
        mailText: `<div style='display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 10vh 10vh 20vh 40vh 10vh;
        width: 90%;
        margin: auto;
        text-align: center; border-radius: 5px; box-shadow: 0 0 10px black;'>
            <h1>Infrarotheizung "EasyHeater" kostenlos!</h1>
            <p style="font-weight: bold">Um den "EasyHeater" kostenlos zu erhalten, müssen Sie lediglich ein Video mit dem bereits gekauften Heizgerät drehen.</p>
            <p style="font-weight: bold">Möchten Sie dieses Angebot wahrnehmen? Schreiben Sie uns!</p>
            <img style='max-height: 100%; margin: auto; border-radius: 5px;' src='http://drive.google.com/uc?export=view&id=1GL__IEwS4S_8HAlZPUPvGNDR3GgSGYYi'>
            <p style='align-self: center; text-align: start; font-weight: bold; font-size: 16px;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "uytsufkutdltsxgb",
        imgName: "easyheaterDE.jpeg",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [{ keyWord: "STRIPE", changeTo: "Stripe" },
            { keyWord: "PAYPAL", changeTo: "PayPal" },
            { keyWord: "EPS", changeTo: "Stripe" },
            { keyWord: 'Nachnahme', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'Paxy za pobraniem', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'Przelew', changeTo: 'Przelew' },
            { keyWord: "WISE", changeTo: "WISE" },
            { keyWord: "Za pobraniem", changeTo: "Paxy za pobraniem" },
            { keyWord: "Klarna", changeTo: "Klarna" },
            { keyWord: "Visa endet mit", changeTo: "Stripe" },
            { keyWord: "PayPro", changeTo: "PayPro" },
        ]
    },
    {
        names: ["Niemcy", "Germany"],
        shortName: "DE",
        viesConfig: jsvat_1.germany,
        currency: "EUR",
        supportEmail: {
            log: "de.easyshop.info@gmail.com",
            pas: "Globalde2021",
            allowMailSending: true
        },
        productName: `Infrarotheizung "EasyHeater" kostenlos!`,
        mailText: `<div style='display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 10vh 10vh 20vh 40vh 10vh;
        width: 90%;
        margin: auto;
        text-align: center; border-radius: 5px; box-shadow: 0 0 10px black;'>
            <h1>Infrarotheizung "EasyHeater" kostenlos!</h1>
            <p style="font-weight: bold">Um den "EasyHeater" kostenlos zu erhalten, müssen Sie lediglich ein Video mit dem bereits gekauften Heizgerät drehen.</p>
            <p style="font-weight: bold">Möchten Sie dieses Angebot wahrnehmen? Schreiben Sie uns!</p>
            <img style='max-height: 100%; margin: auto; border-radius: 5px;' src='http://drive.google.com/uc?export=view&id=1GL__IEwS4S_8HAlZPUPvGNDR3GgSGYYi'>
            <p style='align-self: center; text-align: start; font-weight: bold; font-size: 16px;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "qhzmulqubsetqavi",
        imgName: "easyheaterDE.jpeg",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [
            { keyWord: "STRIPE", changeTo: "Stripe" },
            { keyWord: "klarna", changeTo: "Klarna" },
            { keyWord: "PAYPAL", changeTo: "PayPal" },
            { keyWord: 'Nachnahme', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'Paxy za pobraniem', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'Joom Online', changeTo: 'Joom Online' },
            { keyWord: 'Giropay', changeTo: 'Stripe' },
            { keyWord: 'Visa endet mit', changeTo: 'Stripe' }
        ]
    },
    {
        names: ["Chorwacja", "Croatia"],
        shortName: "HR",
        viesConfig: jsvat_1.croatia,
        currency: "EUR",
        supportEmail: {
            log: "hr.easyshop.info@gmail.com",
            pas: "",
            allowMailSending: true
        },
        productName: 'Infracrvena grijalica "EasyHeater" gratis!',
        mailText: `<div style='display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 10vh 10vh 20vh 40vh 10vh;
        width: 90%;
        margin: auto;
        text-align: center; border-radius: 5px; box-shadow: 0 0 10px black;'>
            <h1>Infracrvena grijalica "EasyHeater" gratis!</h1>
            <p style="font-weight: bold">Da biste dobili "EasyHeater" besplatno, potrebno je samo da napravite video grijača koji ste već kupili.</p>
            <p style="font-weight: bold">Želite li iskoristiti ovu ponudu? Pišite nam!</p>
            <img style='max-height: 100%; margin: auto; border-radius: 5px;' src='http://drive.google.com/uc?export=view&id='>
            <p style='align-self: center; text-align: start; font-weight: bold; font-size: 16px;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/hrk",
        secretCode: "elzvwkeezblkfgwf",
        imgName: "easyheaterCH.jpeg",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [
            { keyWord: "STRIPE", changeTo: "Stripe" },
            { keyWord: "PAYPAL", changeTo: "PayPal" },
            { keyWord: 'Plaćanje pouzećem', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'Paxy za pobraniem', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'PayU', changeTo: 'PayU' }
        ]
    },
    {
        names: ["Grecja", "Greece"],
        shortName: "GR",
        viesConfig: jsvat_1.greece,
        currency: "EUR",
        supportEmail: {
            log: "gr.easyshop.info@gmail.com",
            pas: "",
            allowMailSending: true
        },
        productName: `Υπέρυθρη θερμάστρα "EasyHeater" δωρεάν!`,
        mailText: `<div style='display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 10vh 10vh 20vh 40vh 10vh;
        width: 90%;
        margin: auto;
        text-align: center; border-radius: 5px; box-shadow: 0 0 10px black;'>
            <h1>Υπέρυθρη θερμάστρα "EasyHeater" δωρεάν!</h1>
            <p style="font-weight: bold">Για να λάβετε το "EasyHeater" δωρεάν, πρέπει απλώς να δημιουργήσετε ένα βίντεο με τη θερμάστρα που έχετε ήδη αγοράσει.</p>
            <p style="font-weight: bold">Θα θέλατε να επωφεληθείτε από αυτή την προσφορά; Γράψτε μας!</p>
            <img style='max-height: 100%; margin: auto; border-radius: 5px;' src='http://drive.google.com/uc?export=view&id='>
            <p style='align-self: center; text-align: start; font-weight: bold; font-size: 16px;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "ndozckgpmrnglnrr",
        imgName: "easyheaterGR.jpeg",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [
            { keyWord: "STRIPE", changeTo: "Stripe" },
            { keyWord: "PAYPAL", changeTo: "PayPal" },
            { keyWord: 'Με αντικαταβολή', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'Paxy za pobraniem', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'Za pobraniem', changeTo: 'Paxy za pobraniem' }
        ]
    },
    {
        names: ["Łotwa", "Latvia"],
        shortName: "LV",
        viesConfig: jsvat_1.latvia,
        currency: "EUR",
        supportEmail: {
            log: "lv.easyshop.info@gmail.com",
            pas: "",
            allowMailSending: true
        },
        productName: 'Infrasarkanais sildītājs "EasyHeater" bez maksas!',
        mailText: `<div style='display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 10vh 10vh 20vh 40vh 10vh;
        width: 90%;
        margin: auto;
        text-align: center; border-radius: 5px; box-shadow: 0 0 10px black;'>
            <h1>Infrasarkanais sildītājs "EasyHeater" bez maksas!</h1>
            <p style="font-weight: bold">Lai saņemtu "EasyHeater" bez maksas, jums vienkārši ir jānofilmē video ar jau iegādātu sildītāju.</p>
            <p style="font-weight: bold">Vai vēlaties izmantot šo piedāvājumu? Rakstiet mums!</p>
            <img style='max-height: 100%; margin: auto; border-radius: 5px;' src='http://drive.google.com/uc?export=view&id=1oYeXm4m91eJBY6XA0XWHXM2EcFEirgs5'>
            <p style='align-self: center; text-align: start; font-weight: bold; font-size: 16px;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "rksucufmjgqugebh",
        imgName: "easyheaterLV.jpeg",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [
            { keyWord: "STRIPE", changeTo: "Stripe" },
            { keyWord: "PAYPAL", changeTo: "PayPal" },
            { keyWord: 'Samaksa pēc piegādes', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'Paxy za pobraniem', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'Za pobraniem', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'PayU', changeTo: 'PayU' }
        ]
    },
    {
        names: ["Estonia"],
        shortName: "EE",
        viesConfig: jsvat_1.estonia,
        currency: "EUR",
        supportEmail: {
            log: "est.easyshop.info@gmail.com",
            pas: "",
            allowMailSending: true
        },
        productName: 'Infrapunane kütteseade "EasyHeater" tasuta!',
        mailText: `<div style='display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 10vh 10vh 20vh 40vh 10vh;
        width: 90%;
        margin: auto;
        text-align: center; border-radius: 5px; box-shadow: 0 0 10px black;'>
            <h1>Infrapunane kütteseade "EasyHeater" tasuta!</h1>
            <p style="font-weight: bold">Et saada "EasyHeater" tasuta, peate lihtsalt tegema video juba ostetud kütteseadmega.</p>
            <p style="font-weight: bold">Kas soovite seda pakkumist kasutada? Kirjutage meile!</p>
            <img style='max-height: 100%; margin: auto; border-radius: 5px;' src='http://drive.google.com/uc?export=view&id='>
            <p style='align-self: center; text-align: start; font-weight: bold; font-size: 16px;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "tdxzyslewqfkujrj",
        imgName: "easyheaterEE.jpeg",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [
            { keyWord: "STRIPE", changeTo: "Stripe" },
            { keyWord: "PAYPAL", changeTo: "PayPal" },
            { keyWord: "iDeal", changeTo: "Stripe" },
            { keyWord: 'Joom Online', changeTo: 'Joom Online' },
            { keyWord: 'Paxy za pobraniem', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'Sularaha kättetoimet', changeTo: 'Paxy za pobraniem' },
            { keyWord: 'MasterCard ending', changeTo: 'Stripe' },
        ]
    },
    {
        names: ["Holandia", "Netherlands"],
        shortName: "NL",
        viesConfig: jsvat_1.netherlands,
        currency: "EUR",
        supportEmail: {
            log: "nld.easyshop.info@gmail.com",
            pas: "",
            allowMailSending: true
        },
        productName: 'Infraroodverwarming "EasyHeater" gratis!',
        mailText: `<div style='display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 10vh 10vh 20vh 40vh 10vh;
        width: 90%;
        margin: auto;
        text-align: center; border-radius: 5px; box-shadow: 0 0 10px black;'>
            <h1>Infraroodverwarming "EasyHeater" gratis!</h1>
            <p style="font-weight: bold">Om de "EasyHeater" gratis te ontvangen, hoeft u alleen maar een video te maken met de verwarming die u al hebt gekocht.</p>
            <p style="font-weight: bold">Wilt u gebruik maken van dit aanbod? Schrijf ons!</p>
            <img style='max-height: 100%; margin: auto; border-radius: 5px;' src='http://drive.google.com/uc?export=view&id='>
            <p style='align-self: center; text-align: start; font-weight: bold; font-size: 16px;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "oriltnvoujnxjuqv",
        imgName: "easyheaterNE.jpeg",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [
            { keyWord: "STRIPE", changeTo: "Stripe" },
            { keyWord: "PAYPAL", changeTo: "PayPal" },
            { keyWord: "PayU", changeTo: "PayU" },
            { keyWord: "Joom Online", changeTo: "Joom Online" }
        ]
    },
    {
        names: ["Belgia", "Belgium"],
        shortName: "BE",
        viesConfig: jsvat_1.belgium,
        currency: "EUR",
        supportEmail: {
            log: "be.easyshop.info@gmail.com",
            pas: "",
            allowMailSending: true
        },
        productName: 'Infrared heater "EasyHeater" for free!',
        mailText: `<div style='display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 10vh 10vh 20vh 40vh 10vh;
        width: 90%;
        margin: auto;
        text-align: center; border-radius: 5px; box-shadow: 0 0 10px black;'>
            <h1>Infrared heater "EasyHeater" for free!</h1>
            <p style="font-weight: bold">To receive the "EasyHeater" free of charge, you simply need to make a video with the heater you have already bought.</p>
            <p style="font-weight: bold">Would you like to take advantage of this offer? Write to us!</p>
            <img style='max-height: 100%; margin: auto; border-radius: 5px;' src='http://drive.google.com/uc?export=view&id='>
            <p style='align-self: center; text-align: start; font-weight: bold; font-size: 16px;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "dsrhigouwgonbgvx",
        imgName: "easyheaterBE.jpeg",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [
            {
                keyWord: "STRIPE",
                changeTo: "Stripe"
            },
            {
                keyWord: "PAYPAL",
                changeTo: "PayPal"
            },
            {
                keyWord: "Bancontact",
                changeTo: "Stripe"
            },
            {
                keyWord: "PayU",
                changeTo: "PayU"
            }
        ]
    },
    {
        names: ["Portugalia", "Portugal"],
        shortName: "PT",
        viesConfig: jsvat_1.portugal,
        currency: "EUR",
        supportEmail: {
            log: "",
            pas: "",
            allowMailSending: true
        },
        productName: '',
        mailText: ``,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "",
        imgName: "",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [{ keyWord: "STRIPE", changeTo: "Stripe" }, { keyWord: "PAYPAL", changeTo: "PayPal" }, { keyWord: "Przelew", changeTo: "Przelew" }]
    },
    {
        names: ["Hiszpania", "Spain"],
        shortName: "ES",
        viesConfig: jsvat_1.spain,
        currency: "EUR",
        supportEmail: {
            log: "",
            pas: "",
            allowMailSending: false
        },
        productName: '',
        mailText: ``,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "",
        imgName: "",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [
            { keyWord: "STRIPE", changeTo: "Stripe" },
            { keyWord: "PAYPAL", changeTo: "PayPal" },
            { keyWord: "Joom Online", changeTo: "Joom Online" },
            { keyWord: "Za pobraniem FREE Co", changeTo: "Za pobraniem FREE Company" },
        ]
    },
    {
        names: ["Francja", "France"],
        shortName: "FR",
        viesConfig: jsvat_1.france,
        currency: "EUR",
        supportEmail: {
            log: "",
            pas: "",
            allowMailSending: false
        },
        productName: '',
        mailText: ``,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "",
        imgName: "",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [{ keyWord: "STRIPE", changeTo: "Stripe" }, { keyWord: "PAYPAL", changeTo: "PayPal" }]
    },
    {
        names: ["Włochy", "Italy"],
        shortName: "IT",
        viesConfig: jsvat_1.italy,
        currency: "EUR",
        supportEmail: {
            log: "",
            pas: "",
            allowMailSending: false
        },
        productName: '',
        mailText: ``,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "",
        imgName: "",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [
            { keyWord: "STRIPE", changeTo: "Stripe" },
            { keyWord: "PAYPAL", changeTo: "PayPal" },
            { keyWord: "Za pobraniem FREE Company", changeTo: "Za pobraniem FREE Company" },
            { keyWord: "Za pobraniem FREE Co", changeTo: "Za pobraniem FREE Company" }
        ]
    },
    {
        names: ["Finland", "Finlandia"],
        shortName: "FI",
        viesConfig: jsvat_1.finland,
        currency: "PLN",
        supportEmail: {
            log: "",
            pas: "",
            allowMailSending: false
        },
        productName: '',
        mailText: ``,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "",
        imgName: "",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [
            { keyWord: "PayU", changeTo: "PayU" }
        ]
    },
    {
        names: ["Irlandia", "Ireland"],
        shortName: "IE",
        viesConfig: jsvat_1.ireland,
        currency: "EUR",
        supportEmail: {
            log: "",
            pas: "",
            allowMailSending: false
        },
        productName: '',
        mailText: ``,
        convCurGetRequestWay: "",
        secretCode: "",
        imgName: "",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [
            { keyWord: "Joom Online", changeTo: "Joom Online" },
            { keyWord: "PayU", changeTo: "PayU" },
            { keyWord: "Przelew własny", changeTo: "Przelew" }
        ]
    },
    {
        names: ["Cypr"],
        shortName: "CY",
        viesConfig: jsvat_1.cyprus,
        currency: "EUR",
        supportEmail: {
            log: "",
            pas: "",
            allowMailSending: false
        },
        productName: '',
        mailText: ``,
        convCurGetRequestWay: "",
        secretCode: "",
        imgName: "",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [
            { keyWord: "Przelew własny", changeTo: "Przelew" }
        ]
    },
    {
        names: ["Switzerland", "Szwajcaria"],
        shortName: "CH",
        viesConfig: jsvat_1.switzerland,
        currency: "EUR",
        supportEmail: {
            log: "",
            pas: "",
            allowMailSending: false
        },
        productName: '',
        mailText: ``,
        convCurGetRequestWay: "",
        secretCode: "",
        imgName: "",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [
            { keyWord: "Przelew własny", changeTo: "Przelew" },
            { keyWord: "Joom Online", changeTo: "Joom Online" }
        ]
    },
    {
        names: ["Slovenia", "Słowenia"],
        shortName: "SI",
        viesConfig: jsvat_1.slovenia,
        currency: "EUR",
        supportEmail: {
            log: "",
            pas: "",
            allowMailSending: false
        },
        productName: '',
        mailText: ``,
        convCurGetRequestWay: "",
        secretCode: "",
        imgName: "",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [
            { keyWord: "Przelew własny", changeTo: "Przelew" },
            { keyWord: "Joom Online", changeTo: "Joom Online" },
            { keyWord: "Stripe", changeTo: "Stripe" }
        ]
    },
    {
        names: ["Norwegia"],
        shortName: "NO",
        viesConfig: jsvat_1.norway,
        currency: "EUR",
        supportEmail: {
            log: "",
            pas: "",
            allowMailSending: false
        },
        productName: '',
        mailText: ``,
        convCurGetRequestWay: "",
        secretCode: "",
        imgName: "",
        errorToIgnore: [],
        factureToIgnoreError: [],
        paymentMethods: [
            { keyWord: "Joom Online", changeTo: "Joom Online" },
        ]
    }
];
function ifContainCountryName(lookingName) {
    for (let countryElement of country) {
        for (let countryName of countryElement.names) {
            if (countryName === lookingName) {
                return true;
            }
        }
    }
    return false;
}
exports.ifContainCountryName = ifContainCountryName;
function getCountryObjectIfName(lookingName) {
    for (let countryElement of country) {
        for (let countryName of countryElement.names) {
            if (countryName === lookingName) {
                return countryElement;
            }
        }
    }
    return null;
}
exports.getCountryObjectIfName = getCountryObjectIfName;
exports.default = country;
