// data.ts
// Jen surová data – žádná logika
// Interface definuje tvar každého objektu – TypeScript sám zkontroluje že data sedí

interface RawZbran {
    id: string;
    nazev: string;
    popis: string;
    typ: string;
    poskozeni: number;
    rychlost: number;
    multiplikatorRarity: number;
    rarity: string;
    vaha: number;
}

interface RawBrneni {
    id: string;
    nazev: string;
    popis: string;
    typ: string;
    obrana: number;
    rychlost: number;
    multiplikatorRarity: number;
    rarity: string;
    vaha: number;
}

interface RawLektvar {
    id: string;
    nazev: string;
    popis: string;
    typ: string;
    efekt: string;
    trvaniEfektu: number;
    multiplikatorRarity: number;
    rarity: string;
    vaha: number;
}

interface RawSvitek {
    id: string;
    nazev: string;
    popis: string;
    typ: string;
    efekt: string;
    trvaniEfektu: number;
    multiplikatorRarity: number;
    rarity: string;
    vaha: number;
}

export const rawZbrane: RawZbran[] = [
    { id: "zbr001", nazev: "Meč",            popis: "Ostrý meč pro boj na blízko.",                 typ: "meč",    poskozeni: 10, rychlost: 5, multiplikatorRarity: 1.0, rarity: "běžná",      vaha: 2.5 },
    { id: "zbr002", nazev: "Dýka",           popis: "Malá a rychlá zbraň pro tiché útoky.",          typ: "dýka",   poskozeni: 5,  rychlost: 8, multiplikatorRarity: 1.0, rarity: "běžná",      vaha: 0.5 },
    { id: "zbr003", nazev: "Kladivo",        popis: "Těžké kladivo pro silné údery.",                typ: "kladivo",poskozeni: 15, rychlost: 3, multiplikatorRarity: 1.0, rarity: "běžná",      vaha: 5.0 },
    { id: "zbr004", nazev: "Luk",            popis: "Zbraň pro boj na dálku.",                       typ: "luk",    poskozeni: 8,  rychlost: 6, multiplikatorRarity: 1.0, rarity: "běžná",      vaha: 1.5 },
    { id: "zbr005", nazev: "Kopí",           popis: "Dlouhé kopí pro boj na střední vzdálenost.",    typ: "kopí",   poskozeni: 12, rychlost: 4, multiplikatorRarity: 1.0, rarity: "běžná",      vaha: 3.0 },
    { id: "zbr006", nazev: "Válečná sekera", popis: "Těžká sekera pro drcení štítů.",                typ: "sekera", poskozeni: 18, rychlost: 2, multiplikatorRarity: 1.2, rarity: "neobvyklá",  vaha: 6.0 },
    { id: "zbr007", nazev: "Hůl mága",      popis: "Magická hůl pro sesílání kouzel.",              typ: "hůl",    poskozeni: 12, rychlost: 6, multiplikatorRarity: 1.5, rarity: "vzácná",     vaha: 1.5 },
    { id: "zbr008", nazev: "Dlouhý meč",    popis: "Výkonný meč pro zkušené bojovníky.",            typ: "meč",    poskozeni: 14, rychlost: 4, multiplikatorRarity: 1.2, rarity: "neobvyklá",  vaha: 3.5 },
    { id: "zbr009", nazev: "Kuše",           popis: "Přesná zbraň pro boj na dálku.",                typ: "kuše",   poskozeni: 20, rychlost: 2, multiplikatorRarity: 1.3, rarity: "neobvyklá",  vaha: 4.0 },
    { id: "zbr010", nazev: "Dračí meč",     popis: "Legendární meč ukutý z dračích šupin.",         typ: "meč",    poskozeni: 35, rychlost: 5, multiplikatorRarity: 3.0, rarity: "legendární", vaha: 4.5 },
];

export const rawBrneni: RawBrneni[] = [
    { id: "brn001", nazev: "Kožená zbroj",    popis: "Lehká zbroj pro základní ochranu.",       typ: "kožená zbroj", obrana: 5,  rychlost: -1, multiplikatorRarity: 1.0, rarity: "běžná",      vaha: 3.0  },
    { id: "brn002", nazev: "Kovová zbroj",    popis: "Těžká zbroj pro vysokou ochranu.",        typ: "kovová zbroj", obrana: 10, rychlost: -3, multiplikatorRarity: 1.0, rarity: "běžná",      vaha: 8.0  },
    { id: "brn003", nazev: "Plátová zbroj",   popis: "Zbroj s pláty pro vyváženou ochranu.",    typ: "plátová zbroj",obrana: 8,  rychlost: -2, multiplikatorRarity: 1.0, rarity: "běžná",      vaha: 6.0  },
    { id: "brn004", nazev: "Kroužková zbroj", popis: "Zbroj s kroužky pro flexibilní ochranu.", typ: "kroužková",    obrana: 6,  rychlost: -1, multiplikatorRarity: 1.0, rarity: "běžná",      vaha: 4.0  },
    { id: "brn005", nazev: "Plášť",            popis: "Lehký plášť pro základní ochranu.",       typ: "plášť",        obrana: 3,  rychlost: 0,  multiplikatorRarity: 1.0, rarity: "běžná",      vaha: 1.0  },
    { id: "brn006", nazev: "Drátěná kukla",   popis: "Lehká ochrana hlavy.",                     typ: "kukla",        obrana: 4,  rychlost: 0,  multiplikatorRarity: 1.0, rarity: "běžná",      vaha: 1.5  },
    { id: "brn007", nazev: "Rytířská zbroj",  popis: "Těžká plná zbroj pro rytíře.",             typ: "plná zbroj",   obrana: 20, rychlost: -5, multiplikatorRarity: 2.0, rarity: "vzácná",     vaha: 20.0 },
    { id: "brn008", nazev: "Elfský plášť",    popis: "Magický plášť elfů pro nenápadný pohyb.", typ: "plášť",        obrana: 6,  rychlost: 3,  multiplikatorRarity: 1.8, rarity: "vzácná",     vaha: 0.8  },
    { id: "brn009", nazev: "Dračí šupiny",    popis: "Brnění z pravých dračích šupin.",          typ: "šupiny",       obrana: 25, rychlost: -2, multiplikatorRarity: 2.5, rarity: "legendární", vaha: 12.0 },
];

export const rawLektvary: RawLektvar[] = [
    { id: "lek001", nazev: "Lektvar zdraví",        popis: "Obnovuje zdraví postavy.",              typ: "lektvar zdraví",        efekt: "obnova zdraví",    trvaniEfektu: 0,   multiplikatorRarity: 1.0, rarity: "běžná",      vaha: 0.5 },
    { id: "lek002", nazev: "Lektvar many",           popis: "Obnovuje manu postavy.",                typ: "lektvar many",          efekt: "obnova many",      trvaniEfektu: 0,   multiplikatorRarity: 1.0, rarity: "běžná",      vaha: 0.5 },
    { id: "lek003", nazev: "Lektvar síly",           popis: "Dočasně zvyšuje sílu postavy.",         typ: "lektvar síly",          efekt: "zvýšení síly",     trvaniEfektu: 60,  multiplikatorRarity: 1.0, rarity: "běžná",      vaha: 0.5 },
    { id: "lek004", nazev: "Lektvar rychlosti",      popis: "Dočasně zvyšuje rychlost postavy.",     typ: "lektvar rychlosti",     efekt: "zvýšení rychlosti",trvaniEfektu: 60,  multiplikatorRarity: 1.0, rarity: "běžná",      vaha: 0.5 },
    { id: "lek005", nazev: "Lektvar jedu",           popis: "Způsobuje poškození nepříteli.",         typ: "lektvar jedu",          efekt: "jed",              trvaniEfektu: 30,  multiplikatorRarity: 1.2, rarity: "neobvyklá",  vaha: 0.5 },
    { id: "lek006", nazev: "Lektvar neviditelnosti", popis: "Dočasně skryje postavu.",               typ: "lektvar neviditelnosti",efekt: "neviditelnost",    trvaniEfektu: 45,  multiplikatorRarity: 2.0, rarity: "vzácná",     vaha: 0.5 },
    { id: "lek007", nazev: "Elixír hrdinství",       popis: "Zvyšuje všechny statistiky najednou.",  typ: "elixír",               efekt: "vše+",             trvaniEfektu: 120, multiplikatorRarity: 3.0, rarity: "legendární", vaha: 0.8 },
];

export const rawSvitky: RawSvitek[] = [
    { id: "svi001", nazev: "Svitek ohně",       popis: "Vyvolá ohnivou kouli.",                        typ: "svitek", efekt: "ohnivá koule",     trvaniEfektu: 0,  multiplikatorRarity: 1.5, rarity: "neobvyklá", vaha: 0.2 },
    { id: "svi002", nazev: "Svitek blesku",      popis: "Přivolá blesk z nebe.",                        typ: "svitek", efekt: "blesk",            trvaniEfektu: 0,  multiplikatorRarity: 2.0, rarity: "vzácná",    vaha: 0.2 },
    { id: "svi003", nazev: "Svitek léčení",      popis: "Okamžitě obnoví zdraví celé skupiny.",         typ: "svitek", efekt: "skupinové léčení", trvaniEfektu: 0,  multiplikatorRarity: 1.8, rarity: "vzácná",    vaha: 0.2 },
    { id: "svi004", nazev: "Svitek ochrany",     popis: "Vytvoří magický štít kolem postavy.",          typ: "svitek", efekt: "magický štít",     trvaniEfektu: 30, multiplikatorRarity: 1.6, rarity: "neobvyklá", vaha: 0.2 },
    { id: "svi005", nazev: "Svitek teleportace", popis: "Okamžitě přemístí postavu na bezpečné místo.", typ: "svitek", efekt: "teleportace",      trvaniEfektu: 0,  multiplikatorRarity: 2.5, rarity: "vzácná",    vaha: 0.2 },
];