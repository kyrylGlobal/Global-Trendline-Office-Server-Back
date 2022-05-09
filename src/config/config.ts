import {Country, czechRepublic, hungary, romania, slovakiaRepublic, bulgaria, lithuania, austria, germany, croatia, greece, poland, latvia} from 'jsvat'


interface BaselinkerCountry {
    name: string,
    shortName: string,
    viesConfig: Country,
    currency: string
}

const country: BaselinkerCountry[] = [
    {
        name: "Polska",
        shortName: "PL",
        viesConfig: poland, 
        currency: "PLN"
    },
    {
        name: "Czechy",
        shortName: "CZ",
        viesConfig: czechRepublic, 
        currency: "CZK"
    },
    {
        name: "Węgry",
        shortName: "HU",
        viesConfig: hungary, 
        currency: "HUF"
    },
    {
        name: "Rumunia",
        shortName: "RO",
        viesConfig: romania, 
        currency: "RON"
    },
    {
        name: "Słowacja",
        shortName: "SK",
        viesConfig: slovakiaRepublic, 
        currency: "EUR"
    },
    {
        name: "Bułgaria",
        shortName: "BG",
        viesConfig: bulgaria, 
        currency: "BGN"
    },
    {
        name: "Litwa",
        shortName: "LT",
        viesConfig: lithuania, 
        currency: "EUR"
    },
    {
        name: "Austria",
        shortName: "AT",
        viesConfig: austria, 
        currency: "EUR"
    },
    {
        name: "Niemcy",
        shortName: "DE",
        viesConfig: germany, 
        currency: ""
    },
    {
        name: "Chorwacja",
        shortName: "HR",
        viesConfig: croatia, 
        currency: "HRK"
    },
    {
        name: "Grecja",
        shortName: "GR",
        viesConfig: greece, 
        currency: "EUR"
    },
    {
        name: "Łotwa",
        shortName: "LV",
        viesConfig: latvia,
        currency: "EUR"
    }
];

export const countryCurrency = [
    {
        country: "Polska",
        currency: "PLN"
    },
    {
        country: "Czechy",
        currency: "CZK"
    },
    {
        country: "Węgry",
        currency: "HUF"
    },
    {
        country: "Rumunia",
        currency: "RON"
    },
    {
        country: "Słowacja",
        currency: "EUR"
    },
    {
        country: "Bułgaria",
        currency: "BGN"
    },
    {
        country: "Litwa",
        currency: "EUR"
    },
    {
        country: "Austria",
        currency: "EUR"
    },
    {
        country: "Niemcy",
        currency: "EUR"
    },
    {
        country: "Chorwacja",
        currency: "HRK"
    },
    {
        country: "Grecja",
        currency: "EUR"
    }
]

export default country;