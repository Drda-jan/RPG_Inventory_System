// scroll.ts
// Třída Svitek – potomek (dědí z) třídy Polozka.
// Svitky jsou podobné lektvarům – mají efekt a po použití zmizí.
// Jsou obecně silnější než lektvary (vyšší základní efektivita).

import { Polozka } from "./polozka.js"; // Načteme rodičovskou třídu z jiného souboru

// "extends Polozka" = Svitek dědí vše co má Polozka a přidává efekt a typ.
export class Svitek extends Polozka {

    // ── Vlastnosti specifické pro svitky ─────────────────────────────────────
    private readonly efekt: string; // Co svitek dělá: "ohnivá koule", "blesk", "teleportace"...
    private readonly typ: string;   // Vždy "svitek" – kategorie pro filtrování v obchodě

    // ── Konstruktor ───────────────────────────────────────────────────────────
    constructor(
        id: string,
        nazev: string,
        vaha: number,
        popis: string,
        zakladniCena: number,
        rarity: string,
        multiplikatorRarity: number,
        trvaniEfektu: number, // 0 = okamžitý, >0 = trvá X sekund (např. Svitek ochrany = 30s)
        efekt: string,
        typ: string
    ) {
        // super() předá společné parametry rodičovské třídě Polozka.
        super(id, nazev, vaha, popis, zakladniCena, rarity, trvaniEfektu, multiplikatorRarity);

        // Efekt musí být vyplněný.
        if (!efekt || efekt.trim() === "") throw new Error("efekt nesmí být prázdný.");

        this.efekt = efekt;
        this.typ   = typ;
    }

    // ── Gettery ───────────────────────────────────────────────────────────────
    public getEfekt(): string { return this.efekt; }
    public getTyp():   string { return this.typ; }

    // ── Výpočet efektivity ────────────────────────────────────────────────────
    // Přepisuje abstraktní metodu z Polozka.
    // Svitky začínají na hodnotě 15 (lektvary začínají na 10) – jsou silnější.
    // Svitek s trváním dostane bonus: 15 + trvání/10.
    // Příklad: Svitek ohně (trvani=0)          → 15 (pevná hodnota)
    //          Svitek ochrany (trvani=30)       → 15 + 30/10 = 18
    //          Svitek teleportace (trvani=0)    → 15
    public vypocitejEfektivitu(): number {
        if (this.getTrvaniEfektu() > 0) {
            return 15 + this.getTrvaniEfektu() / 10;
        }
        return 15;
    }
}