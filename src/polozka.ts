// polozka.ts
// Základní šablona (abstraktní třída) pro VŠECHNY předměty v inventáři.
// Zbran, Brneni, Lektvar a Svitek z ní dědí – sdílejí její vlastnosti a metody.
// "abstract" znamená že tuto třídu nelze použít přímo (new Polozka() nejde),
// slouží jen jako základ – jako formulář který musí každý potomek vyplnit.

export abstract class Polozka {

    // ── Soukromé vlastnosti ──────────────────────────────────────────────────
    // "private" = zvenku je nelze číst ani měnit přímo, jen přes gettery níže.
    // "readonly" = nelze je změnit ani uvnitř třídy po vytvoření objektu.
    private readonly id: string;                   // Unikátní identifikátor (např. "zbr001")
    private readonly nazev: string;                // Zobrazovaný název předmětu
    private readonly vaha: number;                 // Váha v kg – ovlivňuje nosnost inventáře
    private readonly zakladniCena: number;         // Základní cena (zatím nevyužita v UI)
    private readonly rarity: string;               // Vzácnost: "běžná", "neobvyklá", "vzácná", "legendární"
    private readonly trvaniEfektu: number;         // Jak dlouho trvá efekt (0 = okamžitý)
    private readonly multiplikatorRarity: number;  // Číslo které zvyšuje efektivitu vzácných předmětů

    // ── Konstruktor ──────────────────────────────────────────────────────────
    // Spustí se automaticky při každém "new Zbran(...)", "new Brneni(...)" atd.
    // Parametr "popis" přijímáme ale neukládáme – zatím ho v UI nevyužíváme.
    constructor(
        id: string,
        nazev: string,
        vaha: number,
        popis: string,
        zakladniCena: number,
        rarity: string,
        trvaniEfektu: number,
        multiplikatorRarity: number
    ) {
        // ── Validace vstupních dat ────────────────────────────────────────────
        // Kontrolujeme že nám někdo nepředal nesmyslné hodnoty.
        // Pokud ano, vyhodíme chybu a objekt se vůbec nevytvoří.
        if (!id || id.trim() === "")       throw new Error("id nesmí být prázdné.");
        if (!nazev || nazev.trim() === "") throw new Error("nazev nesmí být prázdný.");
        if (vaha <= 0)                     throw new Error(`vaha musí být kladná, obdrženo: ${vaha}`);
        if (zakladniCena < 0)             throw new Error(`zakladniCena nesmí být záporná, obdrženo: ${zakladniCena}`);

        // ── Uložení dat ───────────────────────────────────────────────────────
        // Data prošla validací – uložíme je do soukromých proměnných.
        // trim() odstraní nadbytečné mezery na začátku a konci textu.
        this.id                  = id.trim();
        this.nazev               = nazev.trim();
        this.vaha                = vaha;
        this.zakladniCena        = zakladniCena;
        this.rarity              = rarity;
        this.trvaniEfektu        = trvaniEfektu;
        this.multiplikatorRarity = multiplikatorRarity;
    }

    // ── Gettery ───────────────────────────────────────────────────────────────
    // Jediný způsob jak se zvenku dostat k soukromým proměnným.
    // Každý getter jen vrátí hodnotu – nikdo ji nemůže přepsat.
    public getId():                  string { return this.id; }
    public getNazev():               string { return this.nazev; }
    public getVaha():                number { return this.vaha; }
    public getZakladniCena():        number { return this.zakladniCena; }
    public getRarity():              string { return this.rarity; }
    public getTrvaniEfektu():        number { return this.trvaniEfektu; }
    public getMultiplikatorRarity(): number { return this.multiplikatorRarity; }

    // ── Abstraktní metoda ─────────────────────────────────────────────────────
    // Každý potomek (Zbran, Brneni, Lektvar, Svitek) si MUSÍ napsat svou vlastní verzi.
    // Zde jen říkáme "tato metoda existuje a vrací číslo" – výpočet je v každé třídě jiný:
    //   Zbran:   poskozeni * multiplikator
    //   Brneni:  obrana / vaha
    //   Lektvar: podle trvání efektu
    //   Svitek:  vyšší základní hodnota než lektvar
    public abstract vypocitejEfektivitu(): number;

    // ── toString ──────────────────────────────────────────────────────────────
    // Zavolá se automaticky když chceme objekt převést na text (např. console.log).
    // constructor.name vrátí název třídy – "Zbran", "Brneni" atd.
    public toString(): string {
        return `[${this.constructor.name}] ${this.nazev} | Váha: ${this.vaha} kg | Cena: ${this.zakladniCena} zl | Efektivita: ${this.vypocitejEfektivitu().toFixed(2)}`;
    }
}