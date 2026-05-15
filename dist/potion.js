// potions.ts
// Třída Elixir – potomek Polozka.
// "import" načte třídu Polozka z jiného souboru, abychom z ní mohli dědit.
import { Polozka } from "./polozka.js";
// lektvar dědí z Polozka a přidává efekt a typ. 
export class lektvar extends Polozka {
    constructor(id, nazev, vaha, popis, zakladniCena, rarity, multiplikatorRarity, trvaniEfektu, efekt, typ) {
        super(id, nazev, vaha, popis, zakladniCena, rarity, trvaniEfektu, multiplikatorRarity);
        if (!efekt || efekt.trim() === "")
            throw new Error("efekt nesmí být prázdný.");
        this.efekt = efekt;
        this.typ = typ;
    }
    getEfekt() {
        return this.efekt;
    }
    getTyp() {
        return this.typ;
    }
    //okamžitý lektvar (trvání = 0) má vždy hodnotu 10.
    //buff lektvar (trvání > 0) má hodnotu trvání/10 - čím déle trvá, tím je efektivnější.
    vypocitejEfektivitu() {
        if (this.getTrvaniEfektu() > 0) {
            return this.getTrvaniEfektu() / 10;
        }
        return 10;
    }
}
