"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCountryObjectIfName = exports.ifContainCountryName = void 0;
const jsvat_1 = require("jsvat");
const country = [
    {
        names: ["Polska", "Poland"],
        shortName: "PL",
        viesConfig: jsvat_1.poland,
        currency: "PLN",
        supportEmail: {
            log: "easyshopzakaz@gmail.com",
            pas: "Trendline2019",
            allowMailSending: true
        },
        productName: "Tunel agrofibrowy – szklarnia „Mega Garden”",
        mailText: `dziękujemy za zakup " Tunelu Agrofibrowego „Mega Garden”! Mamy nadzieję, że jesteście zadowoleni z towaru i chcielibyście podzielić się wrażeniami na jego temat. Oferujemy tunel 3m w prezencie z opłatą tylko za dostawę
Aby skorzystać z tej oferty, należy nagrać wideo-recenzję o naszym produkcie.
Wideo-recenzja musi trwać 1-2 minuty.
Chcemy:
- aby ktoś nagrał Was w pobliżu lub przed tunelem 
- aby powiedzieliście, czy spodobał Wam się produkt i jego jakość
- aby opowiedzieliście, czy łatwo było go zainstalować
- aby opowiedzieliście, czy możecie polecić ten produkt swoim przyjaciołom i naszym klientom?
Jeśli chcecie, możecie dodać swój własny komentarz który uważacie za słuszny.
Ważne:
1. Wideo musi być nagrane poziomo  
2. Upewnijcie się, że jest Was wyraźnie słychać na nagranym wideo 
3. Nie zapomnijcie wspomnieć, że zakup był dokonany na stronie naszego sklepu internetowego EasyShop 
Gotową wideo-recenzję trzeba wysłać nam w formacie pliku (bez kompresji, w oryginalnym rozmiarze) na nasz adres mailowy info@easy-shop.eu 
W następnym dniu roboczym priorytetowo wyślemy Wam obiecany tunel 3m z opłatą tylko za wysyłkę

W sprawie zakupów hurtowych prosimy o kontakt  na nasz adres mailowy: logist@easy-shop.eu`,
        convCurGetRequestWay: ""
    },
    {
        names: ["Czechy", "Czech Republic"],
        shortName: "CZ",
        viesConfig: jsvat_1.czechRepublic,
        currency: "CZK",
        supportEmail: {
            log: "cz.easyshop@gmail.com",
            pas: "czeasy2020",
            allowMailSending: true
        },
        productName: `Tunel z agrovlákna - skleník "Mega Garden"`,
        mailText: `děkujeme, že jste si zakoupili  tunel z agrovlákna "Mega Garden"! Doufáme, že jste se zbožím spokojeni a rádi se s námi podělíte o své dojmy. Nabízíme 3m tunel jako dárek pouze s poplatkem za doručení.
Chcete-li využít této nabídky, musíte nahrát videorecenzi našeho produktu.
Videorecenze musí trvat 1-2 minuty.
Rádi bychom:
- aby vás někdo nahrál v blízkosti tunelu nebo před ním. 
- nám sdělit, zda se vám výrobek líbil a jaká byla jeho kvalita.
- Řekněte nám, jak snadná byla instalace výrobku.
- zda můžete produkt doporučit svým přátelům a zákazníkům.
Pokud chcete, můžete přidat vlastní komentář, který považujete za správný.
Důležité:
1. video musí být nahráno vodorovně  
2. Ujistěte se, že vás je na nahrávaném videu dobře slyšet. 
3. nezapomeňte uvést, že nákup byl proveden na našich webových stránkách EasyShop. 
Hotovou videorecenzi nám musíte zaslat ve formátu souboru (nekomprimovaného, v původní velikosti) na naši e-mailovou adresu: cz.easyshop@gmail.com. 
Následující pracovní den vám zašleme slíbený 3m tunel prioritně a pouze za poštovné.

V případě hromadných nákupů nás prosím kontaktujte na naší e-mailové adrese: logist@easy-shop.eu.`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/czk"
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
        productName: `Agrofiber alagút - "Mega Garden" üvegház`,
        mailText: `köszönjük, hogy megvásárolta az agrofiber  “Mega Garden ” alagutat! Reméljük elégedett az áruval és szeretné megosztani róla a véleményét. 
Ajándékba adunk egy 3 m-es alagutat, Önnek csak szállítási díjat kell megfizetni.
Az ajánlat igénybevételéhez kérjük, készítsen videó értékelést termékünkről.
A videó áttekintése 1-2 perces legyen.
Azt szeretnénk, hogy:
- Valaki vegye videóra Önt az alagút közelében vagy az előtt
- Mondja el, hogy tetszett-e a termék és annak minősége
- Kérjük mondja el, hogy könnyű volt-e telepítése
- Mondja meg, hogy tudja e ajánlani ezt a terméket barátainak és ügyfeleinknek?
Ha szeretne, hozzáfűzheti a saját véleményét.
Fontos:
1. A videót vízszintesen kell rögzíteni
2. Győződjön meg róla, hogy tisztán hallható a rögzített videóban
3. Ne felejtse el megemlíteni, hogy a vásárlás EasyShop webáruházunk honlapján történt
Az elkészült videó-kritikát fájl formátumban (tömörítés nélkül, eredeti méretben) kell elküldeni nekünk az hu.easyshop@gmail.com e-mail címünkre.
A következő munkanapon kiküldjük Önnek az ígért 3 m-es alagutat, amelynek csak szállítási díjat kell fizetni.

Nagykereskedelmi vásárlás esetén kérjük, vegye fel velünk a kapcsolatot e-mailben: logist@easy-shop.eu`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/huf"
    },
    {
        names: ["Rumunia"],
        shortName: "RO",
        viesConfig: jsvat_1.romania,
        currency: "RON",
        supportEmail: {
            log: "",
            pas: "",
            allowMailSending: false
        },
        productName: "",
        mailText: ``,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/ron"
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
        productName: `Tunel z agrovlákna - skleník "Mega Garden"`,
        mailText: `děkujeme, že jste si zakoupili  tunel z agrovlákna "Mega Garden"! Doufáme, že jste se zbožím spokojeni a rádi se s námi podělíte o své dojmy. Nabízíme 3m tunel jako dárek pouze s poplatkem za doručení.
Chcete-li využít této nabídky, musíte nahrát videorecenzi našeho produktu.
Videorecenze musí trvat 1-2 minuty.
Rádi bychom:
- aby vás někdo nahrál v blízkosti tunelu nebo před ním. 
- nám sdělit, zda se vám výrobek líbil a jaká byla jeho kvalita.
- Řekněte nám, jak snadná byla instalace výrobku.
- zda můžete produkt doporučit svým přátelům a zákazníkům.
Pokud chcete, můžete přidat vlastní komentář, který považujete za správný.
Důležité:
1. video musí být nahráno vodorovně  
2. Ujistěte se, že vás je na nahrávaném videu dobře slyšet. 
3. nezapomeňte uvést, že nákup byl proveden na našich webových stránkách EasyShop. 
Hotovou videorecenzi nám musíte zaslat ve formátu souboru (nekomprimovaného, v původní velikosti) na naši e-mailovou adresu: sk.easyshop.info@gmail.com. 
Následující pracovní den vám zašleme slíbený 3m tunel prioritně a pouze za poštovné.

V případě hromadných nákupů nás prosím kontaktujte na naší e-mailové adrese: logist@easy-shop.eu.`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur"
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
        productName: `Тунел от агрофибър – оранжерия "Mega Garden"`,
        mailText: `благодарим ви, че закупихте тунела за агрофибри "Mega Garden"! Надяваме се, че сте доволни от стоките и бихте искали да споделите впечатленията си за тях. Предлагаме 3-метров тунел като подарък само с такса за доставка
За да се възползвате от тази оферта, трябва да запишете видео ревю на нашия продукт.
Видеопрегледът трябва да е с продължителност 1-2 минути.
Бихме искали:
- някой да ви запише в близост до тунела или пред него 
- да ни кажете дали сте харесали продукта и неговото качество.
- Разкажете ни колко лесно беше да инсталирате продукта.
- за да ни кажете дали можете да препоръчате продукта на вашите приятели и клиенти.
Ако искате, можете да добавите свой коментар, който смятате за правилен.
Важно:
1. видеото трябва да бъде записано хоризонтално  
2. Уверете се, че се чувате ясно в записаното видео. 
3. не забравяйте да посочите, че покупката е направена на нашия уебсайт EasyShop 
Изпратете ни готовия видеопреглед във файлов формат (некомпресиран, в оригинален размер) на нашия имейл адрес: bg.easyshop.info@gmail.com
На следващия работен ден ще ви изпратим обещания тунел 3 м с приоритет и само с такси за доставка.

За покупки на едро, моля, свържете се с нас на нашия имейл адрес: logist@easy-shop.eu`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/bgn"
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
        productName: `Agropluošto tunelis - "Mega Garden" šiltnamis`,
        mailText: `dėkojame, kad įsigijote agropluošto tunelį "Mega Garden"! Tikimės, kad liksite patenkinti prekėmis ir norėsite pasidalyti įspūdžiais apie jas. Siūlome 3 m ilgio tunelį kaip dovaną tik su pristatymo mokesčiu
Norėdami pasinaudoti šiuo pasiūlymu, turite įrašyti mūsų gaminio vaizdo peržiūrą.
Vaizdo peržiūra turi būti 1-2 minučių trukmės.
Norėtume:
- kad kas nors jus įrašytų prie tunelio arba priešais jį. 
- pranešti, ar jums patiko produktas ir jo kokybė.
- Papasakokite, kaip lengva buvo įdiegti gaminį.
- pasakyti, ar galite rekomenduoti produktą savo draugams ir klientams.
Jei norite, galite pridėti savo komentarą, kuris, jūsų manymu, yra teisingas.
Svarbu:
1. vaizdo įrašas turi būti įrašytas horizontaliai  
2. Įsitikinkite, kad įrašytame vaizdo įraše jus aiškiai girdėti. 
3. nepamirškite nurodyti, kad pirkinys buvo įsigytas mūsų "EasyShop" svetainėje. 
Paruoštą vaizdo įrašo peržiūrą turite atsiųsti mums failo formatu (nesuspaustą, originalaus dydžio) mūsų el. pašto adresu: lt.easyshop.info@gmail.com 
Kitą darbo dieną išsiųsime jums pažadėtą 3 m tunelį prioritetine tvarka ir sumokėsite tik siuntimo mokesčius.

Jei norite pirkti dideliais kiekiais, susisiekite su mumis el. pašto adresu: logist@easy-shop.eu.`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur"
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
        productName: `Gewächshaustunnel aus Agrofasern - "Mega Garden"`,
        mailText: `vielen Dank für den Kauf des Agrofasertunnels "Mega Garden"! Wir hoffen, dass Sie mit der Ware zufrieden sind und uns Ihre Eindrücke darüber mitteilen möchten. Wir bieten Ihnen einen 3m-Tunnel als Geschenk mit Zahlung nur für die Lieferung
Um dieses Angebot in Anspruch nehmen zu können, müssen Sie eine Videorezension zu unserem Produkt aufnehmen.
Der Videobeitrag muss 1-2 Minuten lang sein.
Wir möchten:
- für jemanden, der Sie in der Nähe oder vor dem Tunnel aufnimmt 
- um uns mitzuteilen, ob Ihnen das Produkt und seine Qualität gefallen haben
- Sagen Sie uns, wie einfach es war, das Produkt zu installieren.
- um uns mitzuteilen, ob Sie das Produkt Ihren Freunden und Kunden empfehlen können.
Wenn Sie möchten, können Sie Ihren eigenen Kommentar hinzufügen, den Sie für richtig halten.
Das ist wichtig:
1. das Video muss horizontal aufgezeichnet werden  
2. Stellen Sie sicher, dass Sie auf dem aufgezeichneten Video deutlich zu hören sind. 
3. Vergessen Sie nicht zu erwähnen, dass der Kauf über unsere EasyShop-Website getätigt wurde. 
Senden Sie uns den fertigen Videobeitrag im Dateiformat (unkomprimiert, Originalgröße) an unsere E-Mail-Adresse: at.easyshop.info@gmail.com 
Am nächsten Werktag senden wir Ihnen den versprochenen Tunnel 3m als Priority mit nur Versandgebühren

Für Großeinkäufe kontaktieren Sie uns bitte unter unserer E-Mail-Adresse: logist@easy-shop.eu`,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur"
    },
    {
        names: ["Niemcy"],
        shortName: "DE",
        viesConfig: jsvat_1.germany,
        currency: "EUR",
        supportEmail: {
            log: "de.easyshop.info@gmail.com",
            pas: "Globalde2021",
            allowMailSending: false
        },
        productName: "",
        mailText: ``,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur"
    },
    {
        names: ["Chorwacja"],
        shortName: "HR",
        viesConfig: jsvat_1.croatia,
        currency: "HRK",
        supportEmail: {
            log: "",
            pas: "",
            allowMailSending: false
        },
        productName: "",
        mailText: ``,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/hrk"
    },
    {
        names: ["Grecja"],
        shortName: "GR",
        viesConfig: jsvat_1.greece,
        currency: "EUR",
        supportEmail: {
            log: "",
            pas: "",
            allowMailSending: false
        },
        productName: "",
        mailText: ``,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur"
    },
    {
        names: ["Łotwa"],
        shortName: "LV",
        viesConfig: jsvat_1.latvia,
        currency: "EUR",
        supportEmail: {
            log: "",
            pas: "",
            allowMailSending: false
        },
        productName: "",
        mailText: ``,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur"
    },
    {
        names: ["Estonia"],
        shortName: "EE",
        viesConfig: jsvat_1.estonia,
        currency: "EUR",
        supportEmail: {
            log: "",
            pas: "",
            allowMailSending: false
        },
        productName: "",
        mailText: ``,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur"
    },
    {
        names: ["Holandia"],
        shortName: "NL",
        viesConfig: jsvat_1.netherlands,
        currency: "EUR",
        supportEmail: {
            log: "",
            pas: "",
            allowMailSending: false
        },
        productName: "",
        mailText: ``,
        convCurGetRequestWay: "http://api.nbp.pl/api/exchangerates/rates/a/eur"
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
