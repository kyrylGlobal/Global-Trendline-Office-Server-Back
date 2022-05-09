import {Country, czechRepublic, hungary, romania, slovakiaRepublic, bulgaria, lithuania, austria, germany, croatia, greece, poland} from 'jsvat'


interface BaselinkerCountry {
    name: string,
    shortName: string,
    viesConfig: Country
}

const country: BaselinkerCountry[] = [
    {
        name: "Polska",
        shortName: "PL",
        viesConfig: poland
    },
    {
        name: "Czechy",
        shortName: "CZ",
        viesConfig: czechRepublic
    },
    {
        name: "Węgry",
        shortName: "HU",
        viesConfig: hungary
    },
    {
        name: "Rumunia",
        shortName: "RO",
        viesConfig: romania
    },
    {
        name: "Słowacja",
        shortName: "SK",
        viesConfig: slovakiaRepublic
    },
    {
        name: "Bułgaria",
        shortName: "BG",
        viesConfig: bulgaria
    },
    {
        name: "Litwa",
        shortName: "LT",
        viesConfig: lithuania
    },
    {
        name: "Austria",
        shortName: "AT",
        viesConfig: austria
    },
    {
        name: "Niemcy",
        shortName: "DE",
        viesConfig: germany
    },
    {
        name: "Chorwacja",
        shortName: "HR",
        viesConfig: croatia
    },
    {
        name: "Grecja",
        shortName: "GR",
        viesConfig: greece
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