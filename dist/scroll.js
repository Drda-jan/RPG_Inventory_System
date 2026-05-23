// scroll.ts
// třída svitek - potomek polozka
// svitek je položka, která se může použít a po použití se zničí
import { Polozka } from "./polozka.js";
export class Svitek extends Polozka {
    constructor(id, nazev, vaha, popis, zakladniCena, rarity, multiplikatorRarity, trvaniEfektu, efekt, typ) {
        super(id, nazev, vaha, popis, zakladniCena, rarity, trvaniEfektu, multiplikatorRarity);
        if (!efekt || efekt.trim() === "")
            throw new Error("efekt nesmí být prázdný.");
        this.efekt = efekt;
        this.typ = typ;
    }
    getEfekt() { return this.efekt; }
    getTyp() { return this.typ; }
    // Okamžitý svitek = 15, svitek s trváním = 15 + trvání/10
    // Svitky jsou obecně silnější než lektvary – vyšší základní hodnota
    vypocitejEfektivitu() {
        if (this.getTrvaniEfektu() > 0) {
            return 15 + this.getTrvaniEfektu() / 10;
        }
        return 15;
    }
}
