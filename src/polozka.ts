
// Abstraktní třída = šablona pro všechny předměty v inventáři.
// Nelze ji použít přímo (new Polozka() nejde) – slouží jen jako základ pro Zbran, Brneni a Lektvar.
// "export" znamená, že tuto třídu mohou používat ostatní soubory.
 
export abstract class Polozka {
    // soukrome vlastnosti - pristupne jen pres gettery a settery
    // "private" znamená, že tyto proměnné jsou schované uvnitř třídy – zvenku je nelze číst ani měnit přímo.
    // "readonly" znamená, že je nelze změnit ani uvnitř třídy po vytvoření objektu.
    private readonly id: string;
    private readonly nazev: string;
    private readonly vaha: number;
    private readonly zakladniCena: number;
    private readonly rarity: string;
    private readonly trvaniEfektu: number;
    private readonly multiplikatorRarity: number;
    
    // Konstruktor se spustí automaticky při vytvoření každého objektu (new Zbran(...) atd.)
    // Parametr "popis" přijímáme, ale neukládáme – zatím ho nevyužíváme.
    constructor(id: string, nazev: string, vaha: number, popis: string, zakladniCena: number, rarity: string, trvaniEfektu: number, multiplikatorRarity: number) {
        // Validace – kontrolujeme, jestli nám někdo nepředal nesmyslná data.
        // Pokud ano, vyhodíme chybu a objekt se vůbec nevytvoří.
        if (!id || id.trim() === "")   throw new Error("id nesmí být prázdné.");
        if (!nazev || nazev.trim() === "") throw new Error("nazev nesmí být prázdný.");
        if (vaha <= 0)                 throw new Error(`vaha musí být kladná, obdrženo: ${vaha}`);
        if (zakladniCena < 0)         throw new Error(`zakladniCena nesmí být záporná, obdrženo: ${zakladniCena}`);
     
        // Data jsou v pořádku – uložíme je do soukromých proměnných.
        this.id           = id.trim();
        this.nazev        = nazev.trim();
        this.vaha         = vaha;
        this.zakladniCena = zakladniCena;
        this.rarity = rarity;
        this.trvaniEfektu = trvaniEfektu;
        this.multiplikatorRarity = multiplikatorRarity;
    }
 
    // Gettery = jediný způsob, jak se zvenku dostat k soukromým proměnným.
    // Díky tomu nikdo nemůže data náhodně přepsat – může je jen číst.
    public getId(): string {
        return this.id;
    }
    public getNazev(): string {
        return this.nazev;
    }
    public getVaha(): number {
        return this.vaha;
    }
    public getZakladniCena(): number {
        return this.zakladniCena;
    }
    public getRarity(): string {
        return this.rarity;
    }
    public getTrvaniEfektu(): number {
        return this.trvaniEfektu;
    }
    public getMultiplikatorRarity(): number {
        return this.multiplikatorRarity;
    }
 
    // Abstraktní metoda = každý potomek (Zbran, Brneni, Lektvar) si MUSÍ napsat svou vlastní verzi.
    // Zde jen říkáme "tato metoda existuje a vrací číslo" – ale nepíšeme jak to číslo spočítat.
    public abstract vypocitejEfektivitu(): number;
 
    // toString() se zavolá automaticky, když chceme objekt převést na text.
    public toString(): string {
        return `[${this.constructor.name}] ${this.nazev} | Váha: ${this.vaha} kg | Cena: ${this.zakladniCena} zl | Efektivita: ${this.vypocitejEfektivitu().toFixed(2)}`;
    }
}
 