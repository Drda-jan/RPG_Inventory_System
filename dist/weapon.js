// weapon.ts
// Třída Zbran – potomek Polozka.
// "import" načte třídu Polozka z jiného souboru, abychom z ní mohli dědit.
import { Polozka } from "./polozka";
// Zbran dědí z Polozka – přebírá všechny její vlastnosti a přidává své: typ, poskozeni, rychlost.
export class Zbran extends Polozka {
    constructor(id, nazev, vaha, popis, zakladniCena, rarity, trvaniEfektu, multiplikatorRarity, typ, poskozeni, rychlost) {
        // super() = zavolá konstruktor rodičovské třídy Polozka se správnými argumenty.
        // OPRAVA: původní kód měl v super() navíc jedno číslo 0, takže parametry byly posunuté.
        super(id, nazev, vaha, popis, zakladniCena, rarity, trvaniEfektu, multiplikatorRarity);
        if (poskozeni <= 0)
            throw new Error(`poskozeni musí být kladné, obdrženo: ${poskozeni}`);
        this.poskozeni = poskozeni;
        this.rychlost = rychlost;
        this.typ = typ;
    }
    getPoskozeni() {
        return this.poskozeni;
    }
    getRychlost() {
        return this.rychlost;
    }
    getTyp() {
        return this.typ;
    }
    // Combat Power = poškození * raritní multiplikátor.
    // Čím vzácnější zbraň, tím vyšší výsledek.
    // OPRAVA: původní kód měl na konci závorky () navíc – return (výpočet)()
    // To by znamenalo "zavolej výsledek jako funkci", což způsobí chybu za běhu.
    vypocitejEfektivitu() {
        return this.poskozeni * this.getMultiplikatorRarity();
    }
}
