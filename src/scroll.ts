// scroll.ts
// třída svitek - potomek polozka
// svitek je položka, která se může použít a po použití se zničí

import { Polozka } from "./polozka.js";

export class Svitek extends Polozka {
    private readonly efekt: string;
    private readonly typ: string;

     constructor(id: string, nazev: string, vaha: number, popis: string, zakladniCena: number, rarity: string, multiplikatorRarity: number, trvaniEfektu: number, efekt: string, typ: string) {
        super(id, nazev, vaha, popis, zakladniCena, rarity, trvaniEfektu, multiplikatorRarity);
        if (!efekt || efekt.trim() === "") throw new Error("efekt nesmí být prázdný.");
        this.efekt = efekt;
        this.typ   = typ;
    }

    public getEfekt(): string { return this.efekt; }
    public getTyp():   string { return this.typ; }

    // Okamžitý svitek = 15, svitek s trváním = 15 + trvání/10
    // Svitky jsou obecně silnější než lektvary – vyšší základní hodnota
    public vypocitejEfektivitu(): number {
        if (this.getTrvaniEfektu() > 0) {
            return 15 + this.getTrvaniEfektu() / 10;
        } 
        return 15;
    }
}