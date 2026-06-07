// polozka.ts
// Základní šablona (abstraktní třída) pro VŠECHNY předměty v inventáři.
// Zbran, Brneni, Lektvar a Svitek z ní dědí – sdílejí její vlastnosti a metody.
// "abstract" znamená že tuto třídu nelze použít přímo (new Polozka() nejde),
// slouží jen jako základ – jako formulář který musí každý potomek vyplnit.
export class Polozka {
    // ── Konstruktor ──────────────────────────────────────────────────────────
    // Spustí se automaticky při každém "new Zbran(...)", "new Brneni(...)" atd.
    // Parametr "popis" přijímáme ale neukládáme – zatím ho v UI nevyužíváme.
    constructor(id, nazev, vaha, popis, zakladniCena, rarity, trvaniEfektu, multiplikatorRarity) {
        // ── Validace vstupních dat ────────────────────────────────────────────
        // Kontrolujeme že nám někdo nepředal nesmyslné hodnoty.
        // Pokud ano, vyhodíme chybu a objekt se vůbec nevytvoří.
        if (!id || id.trim() === "")
            throw new Error("id nesmí být prázdné.");
        if (!nazev || nazev.trim() === "")
            throw new Error("nazev nesmí být prázdný.");
        if (vaha <= 0)
            throw new Error(`vaha musí být kladná, obdrženo: ${vaha}`);
        if (zakladniCena < 0)
            throw new Error(`zakladniCena nesmí být záporná, obdrženo: ${zakladniCena}`);
        // ── Uložení dat ───────────────────────────────────────────────────────
        // Data prošla validací – uložíme je do soukromých proměnných.
        // trim() odstraní nadbytečné mezery na začátku a konci textu.
        this.id = id.trim();
        this.nazev = nazev.trim();
        this.vaha = vaha;
        this.zakladniCena = zakladniCena;
        this.rarity = rarity;
        this.trvaniEfektu = trvaniEfektu;
        this.multiplikatorRarity = multiplikatorRarity;
    }
    // ── Gettery ───────────────────────────────────────────────────────────────
    // Jediný způsob jak se zvenku dostat k soukromým proměnným.
    // Každý getter jen vrátí hodnotu – nikdo ji nemůže přepsat.
    getId() { return this.id; }
    getNazev() { return this.nazev; }
    getVaha() { return this.vaha; }
    getZakladniCena() { return this.zakladniCena; }
    getRarity() { return this.rarity; }
    getTrvaniEfektu() { return this.trvaniEfektu; }
    getMultiplikatorRarity() { return this.multiplikatorRarity; }
    // ── toString ──────────────────────────────────────────────────────────────
    // Zavolá se automaticky když chceme objekt převést na text (např. console.log).
    // constructor.name vrátí název třídy – "Zbran", "Brneni" atd.
    toString() {
        return `[${this.constructor.name}] ${this.nazev} | Váha: ${this.vaha} kg | Cena: ${this.zakladniCena} zl | Efektivita: ${this.vypocitejEfektivitu().toFixed(2)}`;
    }
}
