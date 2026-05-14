// Abstraktní třída = šablona pro všechny předměty v inventáři.
// Nelze ji použít přímo (new Polozka() nejde) – slouží jen jako základ pro Zbran, Brneni a Lektvar.
// "export" znamená, že tuto třídu mohou používat ostatní soubory.
export class Polozka {
    // Konstruktor se spustí automaticky při vytvoření každého objektu (new Zbran(...) atd.)
    // Parametr "popis" přijímáme, ale neukládáme – zatím ho nevyužíváme.
    constructor(id, nazev, vaha, popis, zakladniCena, rarity, trvaniEfektu, multiplikatorRarity) {
        // Validace – kontrolujeme, jestli nám někdo nepředal nesmyslná data.
        // Pokud ano, vyhodíme chybu a objekt se vůbec nevytvoří.
        if (!id || id.trim() === "")
            throw new Error("id nesmí být prázdné.");
        if (!nazev || nazev.trim() === "")
            throw new Error("nazev nesmí být prázdný.");
        if (vaha <= 0)
            throw new Error(`vaha musí být kladná, obdrženo: ${vaha}`);
        if (zakladniCena < 0)
            throw new Error(`zakladniCena nesmí být záporná, obdrženo: ${zakladniCena}`);
        // Data jsou v pořádku – uložíme je do soukromých proměnných.
        this.id = id.trim();
        this.nazev = nazev.trim();
        this.vaha = vaha;
        this.zakladniCena = zakladniCena;
        this.rarity = rarity;
        this.trvaniEfektu = trvaniEfektu;
        this.multiplikatorRarity = multiplikatorRarity;
    }
    // Gettery = jediný způsob, jak se zvenku dostat k soukromým proměnným.
    // Díky tomu nikdo nemůže data náhodně přepsat – může je jen číst.
    getId() {
        return this.id;
    }
    getNazev() {
        return this.nazev;
    }
    getVaha() {
        return this.vaha;
    }
    getZakladniCena() {
        return this.zakladniCena;
    }
    getRarity() {
        return this.rarity;
    }
    getTrvaniEfektu() {
        return this.trvaniEfektu;
    }
    getMultiplikatorRarity() {
        return this.multiplikatorRarity;
    }
    // toString() se zavolá automaticky, když chceme objekt převést na text.
    toString() {
        return `[${this.constructor.name}] ${this.nazev} | Váha: ${this.vaha} kg | Cena: ${this.zakladniCena} zl | Efektivita: ${this.vypocitejEfektivitu().toFixed(2)}`;
    }
}
