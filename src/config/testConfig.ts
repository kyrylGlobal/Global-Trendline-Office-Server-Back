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
        width: 80%;
        margin: auto;
        text-align: center;'>
            <h1>Grzejnik na podczerwień „EasyHeater” za darmo!</h1>
            <p>Żeby otrzymać „EasyHeater” w gratisie, musisz po prostu nagrać filmik z grzejnikiem który już kupiłeś.</p>
            <p>Chcesz skorzystać z tej oferty? Napisz do nas!</p>
            <img style='max-height: 100%; margin: auto;' src='cid:easyheater'>
            <p style='align-self: center; text-align: start;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "",
        secretCode: "lgrfaghkmwbmzjzw"
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
        width: 80%;
        margin: auto;
        text-align: center;'>
            <h1>Infrazářič "EasyHeater" zdarma!</h1>
            <p>Chcete-li získat ohřívač "EasyHeater" zdarma, stačí natočit video s již zakoupeným ohřívačem.</p>
            <p>Chcete tuto nabídku využít? Napište nám!</p>
            <img style='max-height: 100%; margin: auto;' src='cid:easyheater'>
            <p style='align-self: center; text-align: start;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/czk",
        secretCode: "mrbwhoqphobebyhi"
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
        width: 80%;
        margin: auto;
        text-align: center;'>
            <h1>Infravörös fűtés "EasyHeater" ingyen!</h1>
            <p>Ahhoz, hogy ingyenesen megkapja az "EasyHeater", egyszerűen csak egy videót kell készítenie a már megvásárolt fűtőberendezéssel.</p>
            <p>Szeretne élni ezzel az ajánlattal? Írjon nekünk!</p>
            <img style='max-height: 100%; margin: auto;' src='cid:easyheater'>
            <p style='align-self: center; text-align: start;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/huf",
        secretCode: "rqvsawadsxtiragt"
    },
    {
        names: ["Rumunia"],
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
        width: 80%;
        margin: auto;
        text-align: center;'>
            <h1>Încălzitor cu infraroșu "EasyHeater" gratuit!</h1>
            <p>Pentru a primi gratuit "EasyHeater", trebuie doar să realizați un videoclip cu aparatul de încălzire pe care l-ați cumpărat deja.</p>
            <p>Doriți să profitați de această ofertă? Scrieți-ne!</p>
            <img style='max-height: 100%; margin: auto;' src='cid:easyheater'>
            <p style='align-self: center; text-align: start;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/ron",
        secretCode: "gnttqpvzprzrlvjg"
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
        width: 80%;
        margin: auto;
        text-align: center;'>
            <h1>Infrazářič "EasyHeater" zdarma!</h1>
            <p>Chcete-li získat ohřívač "EasyHeater" zdarma, stačí natočit video s již zakoupeným ohřívačem.</p>
            <p>Chcete tuto nabídku využít? Napište nám!</p>
            <img style='max-height: 100%; margin: auto;' src='cid:easyheater'>
            <p style='align-self: center; text-align: start;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "mrbwhoqphobebyhi"
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
        width: 80%;
        margin: auto;
        text-align: center;'>
            <h1>Инфрачервен нагревател "EasyHeater" безплатно!</h1>
            <p>За да получите безплатно "EasyHeater", просто трябва да направите видеоклип с вече закупения отоплителен уред.</p>
            <p>Искате ли да се възползвате от тази оферта? Пишете ни!</p>
            <img style='max-height: 100%; margin: auto;' src='cid:easyheater'>
            <p style='align-self: center; text-align: start;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/bgn",
        secretCode: "aavhgagilndtyapb"
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
        width: 80%;
        margin: auto;
        text-align: center;'>
            <h1>Infraraudonųjų spindulių šildytuvas "EasyHeater" nemokamai!</h1>
            <p>Norėdami nemokamai gauti "EasyHeater", tiesiog turite nufilmuoti vaizdo įrašą su jau įsigytu šildytuvu.</p>
            <p>Ar norėtumėte pasinaudoti šiuo pasiūlymu? Rašykite mums!</p>
            <img style='max-height: 100%; margin: auto;' src='cid:easyheater'>
            <p style='align-self: center; text-align: start;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "bgauhlcgtchidhfq"
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
        width: 80%;
        margin: auto;
        text-align: center;'>
            <h1>Infrarotheizung "EasyHeater" kostenlos!</h1>
            <p>Um den "EasyHeater" kostenlos zu erhalten, müssen Sie lediglich ein Video mit dem bereits gekauften Heizgerät drehen.</p>
            <p>Möchten Sie dieses Angebot wahrnehmen? Schreiben Sie uns!</p>
            <img style='max-height: 100%; margin: auto;' src='cid:easyheater'>
            <p style='align-self: center; text-align: start;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "uytsufkutdltsxgb"
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
        width: 80%;
        margin: auto;
        text-align: center;'>
            <h1>Infrarotheizung "EasyHeater" kostenlos!</h1>
            <p>Um den "EasyHeater" kostenlos zu erhalten, müssen Sie lediglich ein Video mit dem bereits gekauften Heizgerät drehen.</p>
            <p>Möchten Sie dieses Angebot wahrnehmen? Schreiben Sie uns!</p>
            <img style='max-height: 100%; margin: auto;' src='cid:easyheater'>
            <p style='align-self: center; text-align: start;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "qhzmulqubsetqavi"
    },
    {
        names: ["Chorwacja", "Croatia"],
        shortName: "HR",
        viesConfig: croatia, 
        currency: "HRK",
        supportEmail: {
            log: "hr.easyshop.info@gmail.com",
            pas: "",
            allowMailSending: true
        },
        productName: 'Infracrvena grijalica "EasyHeater" gratis!',
        mailText: `<div style='display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 10vh 10vh 20vh 40vh 10vh;
        width: 80%;
        margin: auto;
        text-align: center;'>
            <h1>Infracrvena grijalica "EasyHeater" gratis!</h1>
            <p>Da biste dobili "EasyHeater" besplatno, potrebno je samo da napravite video grijača koji ste već kupili.</p>
            <p>Želite li iskoristiti ovu ponudu? Pišite nam!</p>
            <img style='max-height: 100%; margin: auto;' src='cid:easyheater'>
            <p style='align-self: center; text-align: start;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/hrk",
        secretCode: "elzvwkeezblkfgwf"
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
        width: 80%;
        margin: auto;
        text-align: center;'>
            <h1>Υπέρυθρη θερμάστρα "EasyHeater" δωρεάν!</h1>
            <p>Για να λάβετε το "EasyHeater" δωρεάν, πρέπει απλώς να δημιουργήσετε ένα βίντεο με τη θερμάστρα που έχετε ήδη αγοράσει.</p>
            <p>Θα θέλατε να επωφεληθείτε από αυτή την προσφορά; Γράψτε μας!</p>
            <img style='max-height: 100%; margin: auto;' src='cid:easyheater'>
            <p style='align-self: center; text-align: start;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "ndozckgpmrnglnrr"
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
        width: 80%;
        margin: auto;
        text-align: center;'>
            <h1>Infrasarkanais sildītājs "EasyHeater" bez maksas!</h1>
            <p>Lai saņemtu "EasyHeater" bez maksas, jums vienkārši ir jānofilmē video ar jau iegādātu sildītāju.</p>
            <p>Vai vēlaties izmantot šo piedāvājumu? Rakstiet mums!</p>
            <img style='max-height: 100%; margin: auto;' src='cid:easyheater'>
            <p style='align-self: center; text-align: start;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "rksucufmjgqugebh"
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
        width: 80%;
        margin: auto;
        text-align: center;'>
            <h1>Infrapunane kütteseade "EasyHeater" tasuta!</h1>
            <p>Et saada "EasyHeater" tasuta, peate lihtsalt tegema video juba ostetud kütteseadmega.</p>
            <p>Kas soovite seda pakkumist kasutada? Kirjutage meile!</p>
            <img style='max-height: 100%; margin: auto;' src='cid:easyheater'>
            <p style='align-self: center; text-align: start;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "tdxzyslewqfkujrj"
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
        width: 80%;
        margin: auto;
        text-align: center;'>
            <h1>Infraroodverwarming "EasyHeater" gratis!</h1>
            <p>Om de "EasyHeater" gratis te ontvangen, hoeft u alleen maar een video te maken met de verwarming die u al hebt gekocht.</p>
            <p>Wilt u gebruik maken van dit aanbod? Schrijf ons!</p>
            <img style='max-height: 100%; margin: auto;' src='cid:easyheater'>
            <p style='align-self: center; text-align: start;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "oriltnvoujnxjuqv"
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
        width: 80%;
        margin: auto;
        text-align: center;'>
            <h1>Infrared heater "EasyHeater" for free!</h1>
            <p>To receive the "EasyHeater" free of charge, you simply need to make a video with the heater you have already bought.</p>
            <p>Would you like to take advantage of this offer? Write to us!</p>
            <img style='max-height: 100%; margin: auto;' src='cid:easyheater'>
            <p style='align-self: center; text-align: start;'>Easyshop</p>
        </div>`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur",
        secretCode: "dsrhigouwgonbgvx"
    }
];