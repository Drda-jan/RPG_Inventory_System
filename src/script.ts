// script.ts
// Hlavní soubor – zde se vše propojí dohromady.
// Importujeme třídy a data ze všech ostatních souborů.

import { Polozka } from "./polozka.js";
import { Zbran } from "./weapon.js";
import { Brneni } from "./armor.js";
import { lektvar } from "./potion.js";
import { rawZbrane, rawBrneni, rawLektvary } from "./data.js";

// Inventar drží seznam všech předmětů a hlídá, aby postava nebyla přetížená.
// Pole "polozky" může obsahovat Zbran, Brneni i Lektvar najednou –
// všechny mají společný typ Polozka, takže je lze ukládat dohromady.
class Inventar {
    private polozky: Polozka[] = [];
    private readonly maxKapacita: number;   

    constructor(maxKapacita: number = 50) {
        if (maxKapacita <= 0) throw new Error(`maxKapacita musí být kladná, obdrženo: ${maxKapacita}`);
        this.maxKapacita = maxKapacita;
    }

    // Přidá předmět do inventáře, ale jen pokud se vejde – jinak vyhodí chybu.
    public pridejPolozku(polozka: Polozka): void {
         const novaVaha = this.spoctiCelkouVahu() + polozka.getVaha();
        if (novaVaha > this.maxKapacita) {
            throw new Error(`"${polozka.getNazev()}" by překročilo kapacitu! (${this.spoctiCelkouVahu().toFixed(1)} + ${polozka.getVaha()} > ${this.maxKapacita} kg)`);
        }
        this.polozky.push(polozka);
    }

    // Odebere předmět podle ID. Pokud takové ID v inventáři není, vyhodí chybu.
    public odeberPolozku(id: string): void {
        const idx = this.polozky.findIndex(p => p.getId() === id);
        if (idx === -1) throw new Error(`Položka s id "${id}" nebyla nalezena.`);
        this.polozky.splice(idx, 1);
    }

    // Projde všechny předměty a sečte jejich váhy dohromady.
    public spoctiCelkouVahu(): number {
        return this.polozky.reduce((sum, p) => sum + p.getVaha(), 0);
    }

    // Vrátí kopii pole – aby nikdo zvenku nemohl pole přímo měnit bez použití našich metod.
    public getPolozky(): Polozka[] { return [...this.polozky]; }

    // Polymorfismus v praxi – voláme vypocitejEfektivitu() na každém předmětu.
    // JavaScript sám za běhu pozná, jestli jde o Zbran, Brneni nebo Lektvar,
    // a zavolá správnou verzi metody – každá třída má svůj vlastní vzorec.
    public getEfektivitaVsech(): { nazev: string, typ: string, efektivita: number }[] {
        return this.polozky.map(polozka => ({
            nazev: polozka.getNazev(),
            typ: polozka.constructor.name,
            efektivita: polozka.vypocitejEfektivitu()
        }));
    }
}

// Oživení dat – z číselníku (plain objekty) vytvoříme instance tříd.
const zbrane = rawZbrane.map(d =>
    new Zbran(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, 0, d.multiplikatorRarity, d.typ, d.poskozeni, d.rychlost)
);
const brneni = rawBrneni.map(d =>
    new Brneni(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, d.multiplikatorRarity, d.obrana, d.rychlost, d.typ)
);
const lektvary = rawLektvary.map(d =>
    new lektvar(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, d.multiplikatorRarity, d.trvaniEfektu, d.efekt, d.typ)
);

// Vytvoříme inventář a naplníme ho.
const inventar = new Inventar(50);
[...zbrane, ...brneni, ...lektvary].forEach(p => inventar.pridejPolozku(p));


// Testování polymorfismu – projdeme všechny předměty a vypíšeme jejich efektivitu.
// Každý předmět zavolá svou vlastní verzi vypocitejEfektivitu() – to je polymorfismus.
const vsechnyPredmety: Polozka[] = [...zbrane, ...brneni, ...lektvary];

vsechnyPredmety.forEach(p => {
    console.log(`${p.getNazev()} | typ: ${p.constructor.name} | efektivita: ${p.vypocitejEfektivitu().toFixed(2)}`);
});