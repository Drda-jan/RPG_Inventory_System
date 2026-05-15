// data.ts
// Jen surová data – žádná logika

type RawZbran = {
    id: string;
    nazev: string;
    popis: string;
    typ: string;
    poskozeni: number;
    rychlost: number;
    multiplikatorRarity: number;
    rarity: string;
    vaha: number;
};

type RawBrneni = {
    id: string;
    nazev: string;
    popis: string;
    typ: string;
    obrana: number;
    rychlost: number;
    multiplikatorRarity: number;
    rarity: string;
    vaha: number;
};

type RawLektvar = {
    id: string;
    nazev: string;
    popis: string;
    typ: string;
    efekt: string;
    trvaniEfektu: number;
    multiplikatorRarity: number;
    rarity: string;
    vaha: number;
};

export const rawZbrane: RawZbran[] = [
    {
        id: "zbr001",
        nazev: "Meč",
        popis: "Ostrý meč pro boj na blízko.",
        typ: "meč",
        poskozeni: 10,
        rychlost: 5,
        multiplikatorRarity: 1.0,
        rarity: "běžná",
        vaha: 2.5
    },
    {
        id: "zbr002",
        nazev: "Dýka",
        popis: "Malá a rychlá zbraň pro tiché útoky.",
        typ: "dýka",
        poskozeni: 5,
        rychlost: 8,
        multiplikatorRarity: 1.0,
        rarity: "běžná",
        vaha: 0.5
    },
    {
        id: "zbr003",
        nazev: "Kladivo",
        popis: "Těžké kladivo pro silné údery.",
        typ: "kladivo",
        poskozeni: 15,
        rychlost: 3,
        multiplikatorRarity: 1.0,
        rarity: "běžná",
        vaha: 5.0
    },
    {
        id: "zbr004",
        nazev: "Luk",
        popis: "Zbraň pro boj na dálku.",
        typ: "luk",
        poskozeni: 8,
        rychlost: 6,
        multiplikatorRarity: 1.0,
        rarity: "běžná",
        vaha: 1.5
    },
    {
        id: "zbr005",
        nazev: "Kopí",
        popis: "Dlouhé kopí pro boj na střední vzdálenost.",
        typ: "kopí",
        poskozeni: 12,
        rychlost: 4,
        multiplikatorRarity: 1.0,
        rarity: "běžná",
        vaha: 3.0
    }
];

export const rawBrneni: RawBrneni[] = [
    {
        id: "brn001",
        nazev: "Kožená zbroj",
        popis: "Lehká zbroj pro základní ochranu.",
        typ: "kožená zbroj",
        obrana: 5,
        rychlost: -1,
        multiplikatorRarity: 1.0,
        rarity: "běžná",
        vaha: 3.0
    },
    {
        id: "brn002",
        nazev: "Kovová zbroj",
        popis: "Těžká zbroj pro vysokou ochranu.",
        typ: "kovová zbroj",
        obrana: 10,
        rychlost: -3,
        multiplikatorRarity: 1.0,
        rarity: "běžná",
        vaha: 8.0
    },
    {
        id: "brn003",
        nazev: "Plátová zbroj",
        popis: "Zbroj s pláty pro vyváženou ochranu.",
        typ: "plátová zbroj",
        obrana: 8,
        rychlost: -2,
        multiplikatorRarity: 1.0,
        rarity: "běžná",
        vaha: 6.0
    },
    {
        id: "brn004",
        nazev: "Kroužková zbroj",
        popis: "Zbroj s kroužky pro flexibilní ochranu.",
        typ: "kroužková zbroj",
        obrana: 6,
        rychlost: -1,
        multiplikatorRarity: 1.0,
        rarity: "běžná",
        vaha: 4.0
    },
    {
        id: "brn005",
        nazev: "Plášť",
        popis: "Lehký plášť pro základní ochranu.",
        typ: "plášť",
        obrana: 3,
        rychlost: 0,
        multiplikatorRarity: 1.0,
        rarity: "běžná",
        vaha: 1.0
    }
];

export const rawLektvary: RawLektvar[] = [
    {
        id: "lek001",
        nazev: "Lektvar zdraví",
        popis: "Obnovuje zdraví postavy.",
        typ: "lektvar zdraví",
        efekt: "obnova zdraví",
        trvaniEfektu: 0,
        multiplikatorRarity: 1.0,
        rarity: "běžná",
        vaha: 0.5
    },
    {
        id: "lek002",
        nazev: "Lektvar many",
        popis: "Obnovuje manu postavy.",
        typ: "lektvar many",
        efekt: "obnova many",
        trvaniEfektu: 0,
        multiplikatorRarity: 1.0,
        rarity: "běžná",
        vaha: 0.5
    },
    {
        id: "lek003",
        nazev: "Lektvar síly",
        popis: "Dočasně zvyšuje sílu postavy.",
        typ: "lektvar síly",
        efekt: "zvýšení síly",
        trvaniEfektu: 60,
        multiplikatorRarity: 1.0,
        rarity: "běžná",
        vaha: 0.5
    },
    {
        id: "lek004",
        nazev: "Lektvar rychlosti",
        popis: "Dočasně zvyšuje rychlost postavy.",
        typ: "lektvar rychlosti",
        efekt: "zvýšení rychlosti",
        trvaniEfektu: 60,
        multiplikatorRarity: 1.0,
        rarity: "běžná",
        vaha: 0.5
    }
];