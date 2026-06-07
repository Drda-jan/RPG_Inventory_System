// potion.ts
// Třída Lektvar – potomek (dědí z) třídy Polozka.
// Lektvary se dají použít (tlačítko POUŽÍT v detailu) a po použití zmizí z inventáře.
import { Polozka } from "./polozka.js"; // Načteme rodičovskou třídu z jiného souboru
// "extends Polozka" = Lektvar dědí vše co má Polozka a přidává svůj efekt a typ.
export class Lektvar extends Polozka {
    // ── Konstruktor ───────────────────────────────────────────────────────────
    constructor(id, nazev, vaha, popis, zakladniCena, rarity, multiplikatorRarity, trvaniEfektu, // 0 = okamžitý účinek, >0 = trvá X sekund
    efekt, typ) {
        // super() předá společné parametry rodičovské třídě Polozka.
        super(id, nazev, vaha, popis, zakladniCena, rarity, trvaniEfektu, multiplikatorRarity);
        // Efekt musí být vyplněný – prázdný lektvar nedává smysl.
        if (!efekt || efekt.trim() === "")
            throw new Error("efekt nesmí být prázdný.");
        this.efekt = efekt;
        this.typ = typ;
    }
    // ── Gettery ───────────────────────────────────────────────────────────────
    // getEfekt() používá script.ts při kliknutí na POUŽÍT – podle efektu rozhodne co se stane.
    // Momentálně zpracovaný efekt je jen "obnova zdraví" (+50 HP).
    getEfekt() { return this.efekt; }
    getTyp() { return this.typ; }
    // ── Výpočet efektivity ────────────────────────────────────────────────────
    // Přepisuje abstraktní metodu z Polozka.
    // Okamžitý lektvar (trvaniEfektu = 0) má pevnou hodnotu 10.
    // Buff lektvar (trvaniEfektu > 0) roste s dobou trvání – čím déle trvá, tím je silnější.
    // Příklad: Lektvar síly (trvani=60)        → 60/10 = 6   (méně než okamžitý)
    //          Elixír hrdinství (trvani=120)    → 120/10 = 12 (více než okamžitý)
    //          Lektvar zdraví (trvani=0)        → 10 (pevná hodnota)
    vypocitejEfektivitu() {
        if (this.getTrvaniEfektu() > 0) {
            return this.getTrvaniEfektu() / 10;
        }
        return 10;
    }
}
