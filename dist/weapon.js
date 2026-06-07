// weapon.ts
// Třída Zbran – potomek (dědí z) třídy Polozka.
// Přidává vlastnosti které mají jen zbraně: typ, poškození a rychlost útoku.
import { Polozka } from "./polozka.js"; // Načteme rodičovskou třídu z jiného souboru
// "extends Polozka" = Zbran dědí vše co má Polozka (id, nazev, vaha, gettery...)
// a navíc přidává své vlastní věci.
export class Zbran extends Polozka {
    // ── Konstruktor ───────────────────────────────────────────────────────────
    // Přijme všechny parametry – nejdřív ty co patří Polozce, pak vlastní.
    constructor(id, nazev, vaha, popis, zakladniCena, rarity, trvaniEfektu, multiplikatorRarity, typ, poskozeni, rychlost) {
        // super() = zavolá konstruktor rodičovské třídy Polozka.
        // Předáme jí její parametry – ona si je uloží a zvaliduje.
        super(id, nazev, vaha, popis, zakladniCena, rarity, trvaniEfektu, multiplikatorRarity);
        // Validace vlastní pro zbraně – poškození musí být kladné číslo.
        if (poskozeni <= 0)
            throw new Error(`poskozeni musí být kladné, obdrženo: ${poskozeni}`);
        // Uložení vlastností zbraně.
        this.poskozeni = poskozeni;
        this.rychlost = rychlost;
        this.typ = typ;
    }
    // ── Gettery ───────────────────────────────────────────────────────────────
    // Umožňují číst hodnoty zvenku (např. v script.ts při výpisu detailu předmětu).
    getPoskozeni() { return this.poskozeni; }
    getRychlost() { return this.rychlost; }
    getTyp() { return this.typ; }
    // ── Výpočet efektivity (Combat Power) ────────────────────────────────────
    // Přepisuje abstraktní metodu z Polozka – každá třída ji počítá jinak.
    // Vzorec: poškození × raritní multiplikátor
    // Příklad: Dračí meč (poskozeni=35, multiplikator=3.0) → CP = 105
    //          Běžný meč  (poskozeni=10, multiplikator=1.0) → CP = 10
    // Čím vzácnější zbraň, tím výrazněji multiplikátor zvyšuje výsledek.
    vypocitejEfektivitu() {
        return this.poskozeni * this.getMultiplikatorRarity();
    }
}
