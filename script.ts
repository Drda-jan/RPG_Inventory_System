const rawZbrane = [
    { id: "zbr001", nazev: "Meč", popis: "Ostrý meč pro boj na blízko.", typ: "meč", poskozeni: 10, rychlost: 5, multiplikatorRarity: 1.0, rarity: "běžná", vaha: 2.5 },
    { id: "zbr002", nazev: "Dýka", popis: "Malá a rychlá zbraň pro tiché útoky.", typ: "dýka", poskozeni: 5, rychlost: 8, multiplikatorRarity: 1.0, rarity: "běžná", vaha: 0.5 },
    { id: "zbr003", nazev: "Kladivo", popis: "Těžké kladivo pro silné údery.", typ: "kladivo", poskozeni: 15, rychlost: 3, multiplikatorRarity: 1.0, rarity: "běžná", vaha: 5.0 },
    { id: "zbr004", nazev: "Luk", popis: "Zbraň pro boj na dálku.", typ: "luk", poskozeni: 8, rychlost: 6, multiplikatorRarity: 1.0, rarity: "běžná", vaha: 1.5 },
    { id: "zbr005", nazev: "Kopí", popis: "Dlouhé kopí pro boj na střední vzdálenost.", typ: "kopí", poskozeni: 12, rychlost: 4, multiplikatorRarity: 1.0, rarity: "běžná", vaha: 3.0 } 
]
 
const rawBrneni = [
    { id: "brn001", nazev: "Kožená zbroj", popis: "Lehká zbroj pro základní ochranu.", typ: "kožená zbroj", obrana: 5, rychlost: -1, multiplikatorRarity: 1.0, rarity: "běžná", vaha: 3.0 },
    { id: "brn002", nazev: "Kovová zbroj", popis: "Těžká zbroj pro vysokou ochranu.", typ: "kovová zbroj", obrana: 10, rychlost: -3, multiplikatorRarity: 1.0, rarity: "běžná", vaha: 8.0 },
    { id: "brn003", nazev: "Plátová zbroj", popis: "Zbroj s pláty pro vyváženou ochranu.", typ: "plátová zbroj", obrana: 8, rychlost: -2, multiplikatorRarity: 1.0, rarity: "běžná", vaha: 6.0 },
    { id: "brn004", nazev: "Kroužková zbroj", popis: "Zbroj s kroužky pro flexibilní ochranu.", typ: "kroužková zbroj", obrana: 6, rychlost: -1, multiplikatorRarity: 1.0, rarity: "běžná", vaha: 4.0 },
    { id: "brn005", nazev: "Plášť", popis: "Lehký plášť pro základní ochranu.", typ: "plášť", obrana: 3, rychlost: 0, multiplikatorRarity: 1.0, rarity: "běžná", vaha: 1.0 }
]
 
const rawLektvary = [
    { id: "lek001", nazev: "Lektvar zdraví", popis: "Obnovuje zdraví postavy.", typ: "lektvar zdraví", efekt: "obnova zdraví", trvaniEfektu: 0, multiplikatorRarity: 1.0, rarity: "běžná", vaha: 0.5 },
    { id: "lek002", nazev: "Lektvar many", popis: "Obnovuje manu postavy.", typ: "lektvar many", efekt: "obnova many", trvaniEfektu: 0, multiplikatorRarity: 1.0, rarity: "běžná", vaha: 0.5 },
    { id: "lek003", nazev: "Lektvar síly", popis: "Dočasně zvyšuje sílu postavy.", typ: "lektvar síly", efekt: "zvýšení síly", trvaniEfektu: 60, multiplikatorRarity: 1.0, rarity: "běžná", vaha: 0.5 }, 
    { id: "lek004", nazev: "Lektvar rychlosti", popis: "Dočasně zvyšuje rychlost postavy.", typ: "lektvar rychlosti", efekt: "zvýšení rychlosti", trvaniEfektu: 60, multiplikatorRarity: 1.0, rarity: "běžná", vaha: 0.5 },]
 
    // Abstraktní třída = šablona pro všechny předměty v inventáři.
    // Nelze ji použít přímo (new Polozka() nejde) – slouží jen jako základ pro Zbran, Brneni a Lektvar.
    abstract class Polozka {
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
 
// Zbran dědí z Polozka – přebírá všechny její vlastnosti a přidává své: typ, poskozeni, rychlost.
class Zbran extends Polozka {
    private readonly typ: string;
    private readonly poskozeni: number;
    private readonly rychlost: number;
 
    constructor(id: string, nazev: string, vaha: number, popis: string, zakladniCena: number, rarity: string, trvaniEfektu: number, multiplikatorRarity: number, typ: string, poskozeni: number, rychlost: number) 
    {
        // super() = zavolá konstruktor rodičovské třídy Polozka se správnými argumenty.
        // OPRAVA: původní kód měl v super() navíc jedno číslo 0, takže parametry byly posunuté.
        super(id, nazev, vaha, popis, zakladniCena, rarity, trvaniEfektu, multiplikatorRarity);
        if (poskozeni <= 0) throw new Error(`poskozeni musí být kladné, obdrženo: ${poskozeni}`);
        this.poskozeni = poskozeni;
        this.rychlost = rychlost;
        this.typ = typ;
    }
 
    public getPoskozeni(): number {
        return this.poskozeni;
    }
    public getRychlost(): number {
        return this.rychlost;
    }
    public getTyp(): string {
        return this.typ;
    }
 
    // Combat Power = poškození * raritní multiplikátor.
    // Čím vzácnější zbraň, tím vyšší výsledek.
    // OPRAVA: původní kód měl na konci závorky () navíc – return (výpočet)()
    // To by znamenalo "zavolej výsledek jako funkci", což způsobí chybu za běhu.
    public vypocitejEfektivitu(): number {
        return this.poskozeni * this.getMultiplikatorRarity();
    }
}
 
    // Brneni dědí z Polozka a přidává obrana, rychlost, typ.
    class Brneni extends Polozka {
        private readonly obrana: number;
        private readonly rychlost: number;
        private readonly typ: string;
 
        constructor(id: string, nazev: string, vaha: number, popis: string, zakladniCena: number, rarity: string, multiplikatorRarity: number, obrana: number, rychlost: number, typ: string) {
        super(id, nazev, vaha, popis, zakladniCena, rarity, 0, multiplikatorRarity);
        if (obrana <= 0) throw new Error(`obrana musí být kladná, obdrženo: ${obrana}`);
        this.obrana   = obrana;
        this.rychlost = rychlost;
        this.typ      = typ;
    }
 
    public getObrana(): number {
        return this.obrana;
    }
    public getRychlost(): number {
        return this.rychlost;
    }
    public getTyp(): string {
        return this.typ;
    }
 
    // Efektivita = obrana děleno váha.
    // Lehké brnění s vysokou obranou dostane nejlepší skóre.
    public vypocitejEfektivitu(): number {
        return this.obrana / this.getVaha();
    }
}
 
    // Lektvar dědí z Polozka a přidává efekt a typ.
    class Lektvar extends Polozka {
        private readonly efekt: string;
        private readonly typ: string;
 
        constructor(id: string, nazev: string, vaha: number, popis: string, zakladniCena: number, rarity: string, multiplikatorRarity: number, trvaniEfektu: number, efekt: string, typ: string) {
        super(id, nazev, vaha, popis, zakladniCena, rarity, trvaniEfektu, multiplikatorRarity);
        if (!efekt || efekt.trim() === "") throw new Error("efekt nesmí být prázdný.");
        this.efekt = efekt;
        this.typ   = typ;
    }
    public getEfekt(): string {
        return this.efekt;
    }
    public getTyp(): string {
        return this.typ;
    }
 
    // Okamžitý lektvar (trvání = 0) má vždy hodnotu 10.
    // Buff lektvar (trvání > 0) dostane 10 + trvání/10 – čím déle trvá, tím je efektivnější.
    public vypocitejEfektivitu(): number { 
        if (this.getTrvaniEfektu() > 0) {
            return 10 + this.getTrvaniEfektu() /10
        }
        return 10;
    }
}
 
// Inventar drží seznam všech předmětů a hlídá, aby postava nebyla přetížená.
// Pole "polozky" může obsahovat Zbran, Brneni i Lektvar najednou –
// všechny mají společný typ Polozka, takže je lze ukládat dohromady.
class Inventar {
    private polozky: Polozka[] = [];
    private readonly maxKapacita: number;   
 
    constructor(maxKapacita: number = 50) {
        if (maxKapacita <= 0) throw new Error(`maxKapacita musí být kladná, obdrženo: ${maxKapacita}`);
        this.maxKapacita = maxKapacita;
    }
 
    // Přidá předmět do inventáře, ale jen pokud se vejde – jinak vyhodí chybu.
    public pridejPolozku(polozka: Polozka): void {
         const novaVaha = this.spoctiCelkouVahu() + polozka.getVaha();
        if (novaVaha > this.maxKapacita) {
            throw new Error(`"${polozka.getNazev()}" by překročilo kapacitu! (${this.spoctiCelkouVahu().toFixed(1)} + ${polozka.getVaha()} > ${this.maxKapacita} kg)`);
        }
        this.polozky.push(polozka);
    }
 
    // Odebere předmět podle ID. Pokud takové ID v inventáři není, vyhodí chybu.
    public odeberPolozku(id: string): void {
        const idx = this.polozky.findIndex(p => p.getId() === id);
        if (idx === -1) throw new Error(`Položka s id "${id}" nebyla nalezena.`);
        this.polozky.splice(idx, 1);
    }
 
    // Projde všechny předměty a sečte jejich váhy dohromady.
    public spoctiCelkouVahu(): number {
        return this.polozky.reduce((sum, p) => sum + p.getVaha(), 0);
    }
 
    // Vrátí kopii pole – aby nikdo zvenku nemohl pole přímo měnit bez použití našich metod.
    public getPolozky(): Polozka[] { return [...this.polozky]; }
 
    // Polymorfismus v praxi – voláme vypocitejEfektivitu() na každém předmětu.
    // JavaScript sám za běhu pozná, jestli jde o Zbran, Brneni nebo Lektvar,
    // a zavolá správnou verzi metody – každá třída má svůj vlastní vzorec.
    public getEfektivitaVsech(): { nazev: string, typ: string, efektivita: number }[] {
        return this.polozky.map(polozka => ({
            nazev: polozka.getNazev(),
            typ: polozka.constructor.name,
            efektivita: polozka.vypocitejEfektivitu()
        }));
    }