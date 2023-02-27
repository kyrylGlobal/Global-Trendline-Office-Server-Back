import {Country, czechRepublic, hungary, romania, slovakiaRepublic, bulgaria, lithuania, austria, germany, croatia, greece, poland, latvia, estonia, netherlands, belgium} from 'jsvat'

interface BaselinkerCountry {
    names: string[],
    shortName: string,
    viesConfig: Country,
    currency: string,
    supportEmail: Email,
    productName: string,
    mailText: string,
    convCurGetRequestWay: string,
    secretCode?: string,
    imgName: string,
    errorToIgnore: ErrorTypes[],
    factureToIgnoreError: string[],
    paymentMethods: PaymentMethod[]
}

interface PaymentMethod {
    keyWord: string,
    changeTo: string
}

export enum ErrorTypes {
    CURENCYERROR = "CURENCYERROR"
}

interface Email {
    log: string,
    pas: string,
    allowMailSending: boolean
}

const country: BaselinkerCountry[] = [
    {
        names: ["Polska", "Poland"],
        shortName: "PL",
        viesConfig: poland, 
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
        paymentMethods: [{keyWord: "STRIPE", changeTo: "STRIPE"}, {keyWord: "PAYPAL", changeTo: "PAYPAL"}, {keyWord: "Dotpay", changeTo: "PRZELEWY24"}, {keyWord: "PayU", changeTo: "PayU"}]
    },
    {
        names: ["Czechy", "Czech Republic"],
        shortName: "CZ",
        viesConfig: czechRepublic, 
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
        paymentMethods: [{keyWord: "STRIPE", changeTo: "STRIPE"}, {keyWord: "PAYPAL", changeTo: "PAYPAL"}]
    },
    {
        names: ["Węgry", "Hungary"],
        shortName: "HU",
        viesConfig: hungary,
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
        paymentMethods: [{keyWord: "STRIPE", changeTo: "STRIPE"}, {keyWord: "PAYPAL", changeTo: "PAYPAL"}]
    },
    {
        names: ["Rumunia", "Romania"],
        shortName: "RO",
        viesConfig: romania, 
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
        paymentMethods: [{keyWord: "STRIPE", changeTo: "STRIPE"}, {keyWord: "PAYPAL", changeTo: "PAYPAL"}]
    },
    {
        names: ["Słowacja", "Slovakia"],
        shortName: "SK",
        viesConfig: slovakiaRepublic, 
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
        paymentMethods: [{keyWord: "STRIPE", changeTo: "STRIPE"}, {keyWord: "PAYPAL", changeTo: "PAYPAL"}]
    },
    {
        names: ["Bułgaria", "Bulgaria"],
        shortName: "BG",
        viesConfig: bulgaria, 
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
        paymentMethods: [{keyWord: "STRIPE", changeTo: "STRIPE"}, {keyWord: "PAYPAL", changeTo: "PAYPAL"}]
    },
    {
        names: ["Litwa", "Lithuania"],
        shortName: "LT",
        viesConfig: lithuania, 
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
        paymentMethods: [{keyWord: "STRIPE", changeTo: "STRIPE"}, {keyWord: "PAYPAL", changeTo: "PAYPAL"}]
    },
    {
        names: ["Austria"],
        shortName: "AT",
        viesConfig: austria, 
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
        paymentMethods: [{keyWord: "STRIPE", changeTo: "STRIPE"}, {keyWord: "PAYPAL", changeTo: "PAYPAL"}, {keyWord: "EPS", changeTo: "STRIPE"}]
    },
    {
        names: ["Niemcy", "Germany"],
        shortName: "DE",
        viesConfig: germany, 
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
        paymentMethods: [{keyWord: "STRIPE", changeTo: "STRIPE"}, {keyWord: "PAYPAL", changeTo: "PAYPAL"}]
    },
    {
        names: ["Chorwacja", "Croatia"],
        shortName: "HR",
        viesConfig: croatia, 
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
        paymentMethods: [{keyWord: "STRIPE", changeTo: "STRIPE"}, {keyWord: "PAYPAL", changeTo: "PAYPAL"}]
    },
    {
        names: ["Grecja", "Greece"],
        shortName: "GR",
        viesConfig: greece, 
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
        paymentMethods: [{keyWord: "STRIPE", changeTo: "STRIPE"}, {keyWord: "PAYPAL", changeTo: "PAYPAL"}]
    },
    {
        names: ["Łotwa", "Latvia"],
        shortName: "LV",
        viesConfig: latvia,
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
        paymentMethods: [{keyWord: "STRIPE", changeTo: "STRIPE"}, {keyWord: "PAYPAL", changeTo: "PAYPAL"}]
    },
    {
        names: ["Estonia"],
        shortName: "EE",
        viesConfig: estonia,
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
        paymentMethods: [{keyWord: "STRIPE", changeTo: "STRIPE"}, {keyWord: "PAYPAL", changeTo: "PAYPAL"}, {keyWord: "iDeal", changeTo: "STRIPE"}]
    },
    {
        names: ["Holandia", "Netherlands"],
        shortName: "NL",
        viesConfig: netherlands,
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
        paymentMethods: [{keyWord: "STRIPE", changeTo: "STRIPE"}, {keyWord: "PAYPAL", changeTo: "PAYPAL"}]
    },
    {
        names: ["Belgia", "Belgium"],
        shortName: "BE",
        viesConfig: belgium,
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
        paymentMethods: [{keyWord: "STRIPE", changeTo: "STRIPE"}, {keyWord: "PAYPAL", changeTo: "PAYPAL"}, {keyWord: "Bancontact", changeTo: "STRIPE"}]
    }
];

export function ifContainCountryName(lookingName: string): boolean {
    for(let countryElement of country) {
        for(let countryName of countryElement.names) {
            if(countryName === lookingName) {
                return true;
            }
        }
    }

    return false;
}

export function getCountryObjectIfName(lookingName: string): BaselinkerCountry | null {
    for(let countryElement of country) {
        for(let countryName of countryElement.names) {
            if(countryName === lookingName) {
                return countryElement;
            }
        }
    }
    return null;
}

export default country;