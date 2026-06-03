// armor.ts
// Třída Brneni – potomek (dědí z) třídy Polozka.
// Přidává vlastnosti které mají jen kusy brnění: obrana, rychlost a typ.

import { Polozka } from "./polozka.js"; // Načteme rodičovskou třídu z jiného souboru

// "extends Polozka" = Brneni dědí vše co má Polozka a přidává své vlastní věci.
export class Brneni extends Polozka {

    // ── Vlastnosti specifické pro brnění ─────────────────────────────────────
    private readonly obrana: number;   // Hodnota obrany – zvyšuje max HP hráče (obrana × 2)
    private readonly typ: string;      // Druh brnění: "kožená zbroj", "plášť", "šupiny"...
    private readonly rychlost: number; // Vliv na rychlost hráče – záporné číslo = zpomalení

    // ── Konstruktor ───────────────────────────────────────────────────────────
    constructor(
        id: string,
        nazev: string,
        vaha: number,
        popis: string,
        zakladniCena: number,
        rarity: string,
        multiplikatorRarity: number,
        obrana: number,
        rychlost: number,
        typ: string
    ) {
        // super() předá společné parametry rodičovské třídě Polozka.
        // Brnění nemá trvání efektu, takže předáváme 0.
        super(id, nazev, vaha, popis, zakladniCena, rarity, 0, multiplikatorRarity);

        // Validace – obrana musí být kladné číslo.
        if (obrana <= 0) throw new Error("Obrana musí být kladné číslo.");

        this.obrana   = obrana;
        this.rychlost = rychlost;
        this.typ      = typ;
    }

    // ── Gettery ───────────────────────────────────────────────────────────────
    // getRychlost() vrací záporné číslo u těžkého brnění (penalizace rychlosti).
    // script.ts používá Math.abs() aby získal kladnou hodnotu penalizace.
    public getObrana():   number { return this.obrana; }
    public getRychlost(): number { return this.rychlost; }
    public getTyp():      string { return this.typ; }

    // ── Výpočet efektivity ────────────────────────────────────────────────────
    // Přepisuje abstraktní metodu z Polozka.
    // Vzorec: obrana ÷ váha
    // Lehké brnění s vysokou obranou dostane nejlepší skóre.
    // Příklad: Elfský plášť (obrana=6, vaha=0.8) → 6/0.8 = 7.5
    //          Rytířská zbroj (obrana=20, vaha=20) → 20/20 = 1.0
    // Díky tomu vidíme které brnění je "efektivní na kilogram".
    public vypocitejEfektivitu(): number {
        return this.obrana / this.getVaha();
    }
}