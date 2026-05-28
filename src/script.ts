// script.ts
// Hlavní soubor celé aplikace.
// Tady se propojují všechny třídy, data, logika UI a události.

// ============================================================
// IMPORTY – načtení tříd a dat z ostatních souborů
// ============================================================

import { Polozka } from "./polozka.js";        // Základní třída pro všechny předměty
import { Zbran } from "./weapon.js";            // Zbraně (meč, dýka, kladivo...)
import { Brneni } from "./armor.js";            // Brnění (kožená zbroj, plášť...)
import { Lektvar } from "./potion.js";          // Lektvary (zdraví, síla...)
import { Svitek } from "./scroll.js";           // Svitky (oheň, blesk...)
import {
    rawZbrane, rawBrneni, rawLektvary, rawSvitky,   // Základní předměty z obchodu
    craftingRecepty,                                  // Recepty pro crafting
    rawZbraneCraft, rawBrneniCraft, rawLektvaryCraft  // Předměty dostupné jen přes crafting
} from "./data.js";

// ============================================================
// TŘÍDA INVENTÁŘ – spravuje seznam předmětů hráče
// ============================================================

class Inventar {
    private polozky: Polozka[] = [];          // Pole všech předmětů v inventáři
    private readonly maxKapacita: number;      // Maximální nosnost v kg

    constructor(maxKapacita: number = 50) {
        // Kontrola že kapacita dává smysl
        if (maxKapacita <= 0) throw new Error(`maxKapacita musí být kladná, obdrženo: ${maxKapacita}`);
        this.maxKapacita = maxKapacita;
    }

    // Přidá předmět do inventáře – hodí chybu pokud by přetížil nosnost
    public pridejPolozku(polozka: Polozka): void {
        const novaVaha = this.spoctiCelkouVahu() + polozka.getVaha();
        if (novaVaha > this.maxKapacita) {
            throw new Error(`"${polozka.getNazev()}" by překročilo kapacitu! (${this.spoctiCelkouVahu().toFixed(1)} + ${polozka.getVaha()} > ${this.maxKapacita} kg)`);
        }
        this.polozky.push(polozka);
    }

    // Odebere předmět podle jeho ID – hodí chybu pokud předmět neexistuje
    public odeberPolozku(id: string): void {
        const idx = this.polozky.findIndex(p => p.getId() === id);
        if (idx === -1) throw new Error(`Položka s id "${id}" nebyla nalezena.`);
        this.polozky.splice(idx, 1);
    }

    // Sečte váhu všech předmětů v inventáři
    public spoctiCelkouVahu(): number {
        return this.polozky.reduce((sum, p) => sum + p.getVaha(), 0);
    }

    // Vrátí kopii pole předmětů (aby nešlo pole přímo měnit zvenku)
    public getPolozky(): Polozka[] { return [...this.polozky]; }

    // Vrátí maximální nosnost
    public getMaxKapacita(): number { return this.maxKapacita; }

    // Vrátí efektivitu všech předmětů – používáme pro konzolový výpis
    public getEfektivitaVsech(): { nazev: string, typ: string, efektivita: number }[] {
        return this.polozky.map(polozka => ({
            nazev: polozka.getNazev(),
            typ: polozka.constructor.name,
            efektivita: polozka.vypocitejEfektivitu()
        }));
    }
}

// ============================================================
// OŽIVENÍ DAT – převod surových dat na instance tříd
// Každý řádek v rawZbrane/rawBrneni/... se převede na objekt
// ============================================================

// Zbraně z obchodu
const zbrane = rawZbrane.map(d =>
    new Zbran(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, 0, d.multiplikatorRarity, d.typ, d.poskozeni, d.rychlost)
);
// Brnění z obchodu
const brneni = rawBrneni.map(d =>
    new Brneni(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, d.multiplikatorRarity, d.obrana, d.rychlost, d.typ)
);
// Lektvary z obchodu
const lektvary = rawLektvary.map(d =>
    new Lektvar(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, d.multiplikatorRarity, d.trvaniEfektu, d.efekt, d.typ)
);
// Svitky z obchodu
const svitky = rawSvitky.map(d =>
    new Svitek(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, d.multiplikatorRarity, d.trvaniEfektu, d.efekt, d.typ)
);
// Zbraně dostupné pouze přes crafting (nejdou koupit)
const zbraneCraft = rawZbraneCraft.map(d =>
    new Zbran(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, 0, d.multiplikatorRarity, d.typ, d.poskozeni, d.rychlost)
);
// Brnění dostupné pouze přes crafting
const brneniCraft = rawBrneniCraft.map(d =>
    new Brneni(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, d.multiplikatorRarity, d.obrana, d.rychlost, d.typ)
);
// Lektvary dostupné pouze přes crafting
const lektvaryCraft = rawLektvaryCraft.map(d =>
    new Lektvar(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, d.multiplikatorRarity, d.trvaniEfektu, d.efekt, d.typ)
);

// Mapa všech předmětů (ID → objekt) – slouží k rychlému vyhledání předmětu podle ID
// Používáme ji hlavně v craftingu pro nalezení výsledného předmětu receptu
const vsechnyPredmetyMapa = new Map<string, Polozka>();
[...zbrane, ...brneni, ...lektvary, ...svitky, ...zbraneCraft, ...brneniCraft, ...lektvaryCraft]
    .forEach(p => vsechnyPredmetyMapa.set(p.getId(), p));

// Vytvoření inventáře s nosností 50 kg
const inventar = new Inventar(50);

// ============================================================
// ZLATO – herní měna
// ============================================================

let zlato = 100;        // Počáteční zlaté mince hráče
let aktualniHp = 100;   // Aktuální životy hráče (mění se průzkumem a lektvary)
let herniDen = 1;

function vykresliDen(): void {
    (document.getElementById("den-text") as HTMLElement).textContent = `${herniDen}`;
}

// Vrátí cenu předmětu podle jeho rarity (vzácnější = dražší)
function getCena(p: Polozka): number {
    switch (p.getRarity()) {
        case "legendární": return 500;   // Nejdražší
        case "vzácná":     return 200;
        case "neobvyklá":  return 75;
        default:           return 20;    // Běžné předměty jsou levné
    }
}

// Aktualizuje zobrazení zlatých mincí v UI
function vykresliZlato(): void {
    (document.getElementById("zlato-text") as HTMLElement).textContent = `${zlato}`;
}

// ============================================================
// SMRT A RESTART – zobrazí/skryje obrazovku smrti a resetuje hru
// DŮLEŽITÉ: Tyto funkce musí být PŘED funkcí pruzkum(),
// protože pruzkum() je volá a TypeScript musí vědět že existují
// ============================================================

// Zobrazí overlay "jsi mrtvý"
function zobrazSmrt(): void {
    const okno = document.getElementById("smrt-okno") as HTMLElement;
    okno.style.display = "flex";
}

// Resetuje celou hru do počátečního stavu
function restartHry(): void {
    aktualniHp = 100;   // Obnov životy
    zlato = 100;        // Obnov zlato

    // Vyprázdni inventář – odebereme každý předmět jeden po druhém
    inventar.getPolozky().forEach(p => inventar.odeberPolozku(p.getId()));

    // Skryj obrazovku smrti
    const okno = document.getElementById("smrt-okno") as HTMLElement;
    okno.style.display = "none";

    // Překresli celé UI
    vykresliInventar();
    vykresliDetail();
    vykresliPostavu();
    vykresliZlato();
    herniDen = 1;
    vykresliDen();
}

// ============================================================
// PRŮZKUM – tlačítko které hráči vydělává zlaté mince
// Výsledek je náhodný, lepší SPD = větší odměna
// Po kliknutí má 5s cooldown aby nešlo spamovat
// ============================================================

function pruzkum(): void {
    const btn = document.getElementById("btn-pruzkum") as HTMLButtonElement;

    // Přečteme aktuální SPD ze stránky (formát "50/100", bereme první číslo)
    const spd = parseInt((document.getElementById("val-spd") as HTMLElement).textContent?.split("/")[0] || "50");

    // Náhodné číslo 0–100 určuje co se stane
    const sance = Math.random() * 100;
    let odmenaMince = 0;
    let zprava = "";

    if (sance < 10) {
        // 10% šance – smůla, jen zranění bez odměny
        const zraneni = Math.floor(15 + Math.random() * 20);
        aktualniHp = Math.max(0, aktualniHp - zraneni); // HP neklesne pod 0
        zprava = `Byl jsi přepaden! -${zraneni} HP`;
        vykresliPostavu();

    } else if (sance < 25) {
        // 15% šance – lehké zranění ale aspoň něco našel
        const zraneni = Math.floor(5 + Math.random() * 10);
        aktualniHp = Math.max(0, aktualniHp - zraneni);
        odmenaMince = Math.floor(10 + Math.random() * 15);
        zprava = `Lehce zraněn (-${zraneni} HP) ale našel jsi ${odmenaMince} zlatých!`;
        vykresliPostavu();

    } else if (sance < 55) {
        // 30% šance – průměrný nález
        odmenaMince = Math.floor(10 + Math.random() * 20);
        zprava = `Našel jsi ${odmenaMince} zlatých!`;

    } else if (sance < 80) {
        // 25% šance – dobrý nález, SPD pomáhá
        odmenaMince = Math.floor(30 + (spd / 100) * 30);
        zprava = `Dobrý nález! +${odmenaMince} zlatých.`;

    } else {
        // 20% šance – skvělý nález, SPD výrazně pomáhá
        odmenaMince = Math.floor(60 + (spd / 100) * 60);
        zprava = `Skvělý nález! +${odmenaMince} zlatých!`;
    }

    // Přičti zlaté a překresli
    zlato += odmenaMince;
    vykresliZlato();
    zobrazChybu(zprava);

    // Cooldown – zamkni tlačítko na 5 sekund a ukazuj odpočet
    btn.disabled = true;
    btn.textContent = "⏳ 5s";
    let cas = 5;
    const interval = setInterval(() => {
        cas--;
        btn.textContent = `⏳ ${cas}s`;
        if (cas <= 0) {
            clearInterval(interval);    // Zastav odpočet
            btn.disabled = false;
            btn.textContent = "⚔ PRŮZKUM";
        }
    }, 1000); // Každou sekundu
    herniDen++;
    vykresliDen();
}

// ============================================================
// STATY POSTAVY – počítá a zobrazuje HP, STR, SPD
// Volá se vždy po změně inventáře nebo po zranění
// ============================================================

function vykresliPostavu(): void {
    const polozky  = inventar.getPolozky();
    const celkVaha = inventar.spoctiCelkouVahu();

    // MaxHP = základ 100 + bonus za každý kus brnění (obrana × 2)
    const bonusHP = polozky
        .filter(p => p instanceof Brneni)
        .reduce((sum, p) => sum + (p as Brneni).getObrana() * 2, 0);
    const maxHp = 100 + bonusHP;

    // Aktuální HP nesmí přesáhnout nové maximum (např. po odebrání brnění)
    if (aktualniHp > maxHp) aktualniHp = maxHp;

    // STR = součet efektivity všech zbraní v inventáři
    const sila = polozky
        .filter(p => p instanceof Zbran)
        .reduce((sum, p) => sum + p.vypocitejEfektivitu(), 0);

    // SPD = 100 mínus penalizace za váhu a těžké brnění
    const penalizaceBrneni = polozky
        .filter(p => p instanceof Brneni)
        .reduce((sum, p) => sum + Math.abs((p as Brneni).getRychlost()), 0);
    const rychlost = Math.max(0, Math.round(100 - (celkVaha / inventar.getMaxKapacita()) * 60 - penalizaceBrneni));

    // Zapiš hodnoty do HTML elementů
    (document.getElementById("val-hp")  as HTMLElement).textContent = `${aktualniHp}/${maxHp}`;
    (document.getElementById("val-mp")  as HTMLElement).textContent = `80`;
    (document.getElementById("val-str") as HTMLElement).textContent = `${Math.round(sila)}`;
    (document.getElementById("val-spd") as HTMLElement).textContent = `${rychlost}`;

    // Nastav šířku progress barů (v procentech)
    (document.getElementById("bar-hp")  as HTMLElement).style.width = `${(aktualniHp / maxHp) * 100}%`;
    (document.getElementById("bar-mp")  as HTMLElement).style.width = `100%`;
    (document.getElementById("bar-str") as HTMLElement).style.width = `${Math.min(100, (sila / 100) * 100)}%`;
    (document.getElementById("bar-spd") as HTMLElement).style.width = `${rychlost}%`;

    // Změň barvu HP baru podle toho kolik HP zbývá
    const hpBar = document.getElementById("bar-hp") as HTMLElement;
    const hpProcent = (aktualniHp / maxHp) * 100;
    hpBar.className = "stat-bar hp-bar"
        + (hpProcent <= 20 ? " critical" : hpProcent <= 50 ? " low" : "");
    // critical = červená (kritický stav), low = oranžová, jinak zelená

    // Pokud HP kleslo na 0 nebo méně – zobraz obrazovku smrti
    if (aktualniHp <= 0) {
        zobrazSmrt();
    }
}

// ============================================================
// STAV UI – pomocné proměnné a funkce
// ============================================================

let vybranId: string | null = null;  // ID aktuálně vybraného předmětu v inventáři
let aktivniFiltr = "vse";             // Aktivní filtr v obchodě ("vse", "zbran", "brneni"...)
const MAX_SLOTU = 20;                 // Kolik slotů se zobrazí v mřížce inventáře

// Vrátí emoji ikonu podle typu předmětu
function getIkona(p: Polozka): string {
    if (p instanceof Zbran)   return "⚔️";
    if (p instanceof Brneni)  return "👘";
    if (p instanceof Lektvar) return "🧪";
    if (p instanceof Svitek)  return "📜";
    return "📦"; // Výchozí ikona pro neznámý typ
}

// Vrátí CSS třídu pro barevné označení typu předmětu
function getTypClass(p: Polozka): string {
    if (p instanceof Zbran)   return "typ-zbran";
    if (p instanceof Brneni)  return "typ-brneni";
    if (p instanceof Lektvar) return "typ-lektvar";
    return "";
}

// Zobrazí zprávu/chybu na 3 sekundy a pak ji schová
function zobrazChybu(zprava: string): void {
    const el = document.getElementById("chyba") as HTMLElement;
    el.textContent = zprava;
    el.style.display = "block";
    setTimeout(() => { el.style.display = "none"; }, 3000);
}

// ============================================================
// VYKRESLENÍ INVENTÁŘE – zobrazí mřížku předmětů a statistiky
// ============================================================

function vykresliInventar(): void {
    const mrizka   = document.getElementById("inventar-mrizka") as HTMLElement;
    const vahaText = document.getElementById("vaha-text") as HTMLElement;
    const vahaPruh = document.getElementById("vaha-pruh") as HTMLElement;
    const pocetEl  = document.getElementById("stat-pocet") as HTMLElement;

    const polozky  = inventar.getPolozky();
    const celkVaha = inventar.spoctiCelkouVahu();
    const maxKap   = inventar.getMaxKapacita();
    const procent  = Math.min(100, (celkVaha / maxKap) * 100); // Pro progress bar (max 100%)

    // Aktualizuj text a progress bar nosnosti
    vahaText.textContent = `${celkVaha.toFixed(1)}/${maxKap}kg`;
    vahaPruh.style.width = `${procent}%`;
    // Barva baru: nebezpeci (červená) nad 90%, varovani (oranžová) nad 65%
    vahaPruh.className   = "vaha-pruh" + (procent >= 90 ? " nebezpeci" : procent >= 65 ? " varovani" : "");
    pocetEl.textContent  = `${polozky.length}`; // Počet předmětů

    mrizka.innerHTML = ""; // Vymaž staré sloty

    // Vykresli obsazené sloty (jeden slot = jeden předmět)
    polozky.forEach(p => {
        const slot = document.createElement("div");
        // Pokud je předmět vybraný, přidáme třídu "vybran" pro zvýraznění
        slot.className = `slot obsazeny ${p.getId() === vybranId ? "vybran" : ""}`;
        slot.title     = p.getNazev(); // Tooltip při najetí myší
        slot.innerHTML = `${getIkona(p)}<span class="slot-pocet">${p.vypocitejEfektivitu().toFixed(0)}</span>`;

        // Po kliknutí na slot vyber předmět a překresli detail
        slot.addEventListener("click", () => {
            vybranId = p.getId();
            vykresliInventar();
            vykresliDetail();
        });
        mrizka.appendChild(slot);
    });

    // Doplň prázdné sloty do MAX_SLOTU (vizuální mřížka)
    for (let i = polozky.length; i < MAX_SLOTU; i++) {
        const slot = document.createElement("div");
        slot.className = "slot"; // Prázdný slot bez obsahu
        mrizka.appendChild(slot);
    }
}

// ============================================================
// VYKRESLENÍ DETAILU – zobrazí info o vybraném předmětu
// ============================================================

function vykresliDetail(): void {
    const box     = document.getElementById("detail-box") as HTMLElement;
    const polozky = inventar.getPolozky();

    // Najdi vybraný předmět podle ID
    const p = polozky.find(x => x.getId() === vybranId);

    // Pokud nic není vybráno, zobraz prázdný stav
    if (!p) {
        box.innerHTML = `<div class="prazdny-detail">Vyber<br>předmět</div>`;
        return;
    }

    // Speciální info podle typu předmětu
    let extraInfo = "";
    if (p instanceof Zbran) {
        extraInfo = `
            <div class="detail-label">POŠKOZENÍ</div>
            <div class="detail-hodnota">${p.getPoskozeni()}</div>
            <div class="detail-label">RYCHLOST</div>
            <div class="detail-hodnota">${p.getRychlost()}</div>`;
    } else if (p instanceof Brneni) {
        extraInfo = `
            <div class="detail-label">OBRANA</div>
            <div class="detail-hodnota">${p.getObrana()}</div>
            <div class="detail-label">RYCHLOST</div>
            <div class="detail-hodnota">${p.getRychlost()}</div>`;
    } else if (p instanceof Lektvar) {
        extraInfo = `
            <div class="detail-label">EFEKT</div>
            <div class="detail-hodnota">${p.getEfekt()}</div>
            <button class="btn-pouzit" id="btn-pouzit-lektvar">⚗ POUŽÍT</button>`;
    }

    // Vykresli celý detail panel
    box.innerHTML = `
        <div class="detail-label">ITEM NAME</div>
        <div class="detail-hodnota">${p.getNazev()}</div>
        <span class="detail-ikona-velka">${getIkona(p)}</span>
        <div class="efektivita-radek">
            <span>POWER</span>
            <span>${p.vypocitejEfektivitu().toFixed(1)}</span>
        </div>
        <div class="detail-label">VÁHA</div>
        <div class="detail-hodnota">${p.getVaha()} kg</div>
        <div class="detail-label">RARITA</div>
        <div class="detail-hodnota">${p.getRarity()}</div>
        ${extraInfo}
        <button class="btn-odeber" id="btn-odeber-vybrany">ODEBRAT</button>
    `;

    // Tlačítko ODEBRAT – vyjme předmět z inventáře
    document.getElementById("btn-odeber-vybrany")!.addEventListener("click", () => {
        inventar.odeberPolozku(vybranId!);
        vybranId = null; // Zruš výběr
        vykresliInventar();
        vykresliNabidku();
        vykresliDetail();
        vykresliPostavu();
    });

    // Tlačítko POUŽÍT – pouze pro lektvary, aplikuje efekt a odebere lektvar
    const btnPouzit = document.getElementById("btn-pouzit-lektvar");
    if (btnPouzit) {
        btnPouzit.addEventListener("click", () => {
            const nazev = p.getNazev();
            const efekt = (p as Lektvar).getEfekt();

            // Lektvar zdraví obnoví 50 HP (ale ne přes maximum)
            if (efekt === "obnova zdraví") {
                const polozkyAkt = inventar.getPolozky();
                const bonusHP = polozkyAkt
                    .filter(x => x instanceof Brneni)
                    .reduce((sum, x) => sum + (x as Brneni).getObrana() * 2, 0);
                const maxHp = 100 + bonusHP;
                aktualniHp = Math.min(maxHp, aktualniHp + 50);
            }

            // Odeber použitý lektvar z inventáře
            inventar.odeberPolozku(p.getId());
            vybranId = null;
            vykresliInventar();
            vykresliNabidku();
            vykresliDetail();
            vykresliPostavu();
            zobrazChybu(`✨ Použil jsi ${nazev}!`);
        });
    }
}

// ============================================================
// VYKRESLENÍ NABÍDKY (OBCHOD) – seznam předmětů k zakoupení
// Hráč musí mít dostatek zlatých mincí
// ============================================================

function vykresliNabidku(): void {
    const seznam     = document.getElementById("nabidka-seznam") as HTMLElement;
    seznam.innerHTML = "";

    // Všechny předměty dostupné v obchodě (craft předměty se tu nezobrazují)
    const vsechny: Polozka[] = [...zbrane, ...brneni, ...lektvary, ...svitky];

    // ID předmětů které hráč už má v inventáři
    const vInventari = inventar.getPolozky().map(p => p.getId());

    // Filtruj podle aktivního filtru (tlačítka nad seznamem)
    const filtrovane = vsechny.filter(p => {
        if (aktivniFiltr === "vse")     return true;
        if (aktivniFiltr === "zbran")   return p instanceof Zbran;
        if (aktivniFiltr === "brneni")  return p instanceof Brneni;
        if (aktivniFiltr === "lektvar") return p instanceof Lektvar;
        if (aktivniFiltr === "svitek")  return p instanceof Svitek;
        return true;
    });

    // Vykresli každý předmět jako řádek v seznamu
    filtrovane.forEach(p => {
        const jizPridan = vInventari.includes(p.getId()); // Je už v inventáři?
        const radek     = document.createElement("div");
        radek.className = `nabidka-radek ${getTypClass(p)} ${jizPridan ? "uz-pridano" : ""}`;
        radek.innerHTML = `
            <span class="nabidka-ikona">${getIkona(p)}</span>
            <span class="nabidka-nazev">${p.getNazev()}</span>
            <span class="nabidka-vaha">${p.getVaha()}kg</span>
            <span class="cena-text">🪙${getCena(p)}</span>
            <button class="btn-plus" data-id="${p.getId()}" ${jizPridan ? "disabled" : ""}>
                ${jizPridan ? "✓" : "+"}
            </button>
        `;

        // Tlačítko + – koupí předmět pokud má hráč dost zlatých
        if (!jizPridan) {
            radek.querySelector(".btn-plus")!.addEventListener("click", () => {
                try {
                    // Zkontroluj zda má hráč dost zlatých
                    if (zlato < getCena(p)) {
                        zobrazChybu("Nemáš dost zlatých!");
                        return;
                    }
                    zlato -= getCena(p);         // Odečti cenu
                    inventar.pridejPolozku(p);   // Přidej do inventáře
                    vykresliZlato();
                    vykresliPostavu();
                    vykresliInventar();
                    vykresliNabidku();
                } catch (err) {
                    zobrazChybu((err as Error).message);
                }
            });
        }

        seznam.appendChild(radek);
    });
}

// ============================================================
// PŘEPÍNÁNÍ ZÁLOŽEK – zobrazí správný panel (Inventář/Přidat/Craft)
// ============================================================

function prepniTab(tab: string): void {
    const panelInv   = document.getElementById("panel-inventar") as HTMLElement;
    const panelNab   = document.getElementById("panel-nabidka")  as HTMLElement;
    const panelCraft = document.getElementById("panel-crafting") as HTMLElement;

    // Odeber třídu "aktivni" ze všech záložek a přidej ji na tu kliknutou
    document.querySelectorAll(".zalozka").forEach(z => z.classList.remove("aktivni"));
    document.querySelector(`[data-tab="${tab}"]`)?.classList.add("aktivni");

    // Skryj všechny panely
    panelInv.style.display   = "none";
    panelNab.style.display   = "none";
    panelCraft.style.display = "none";

    // Zobraz pouze ten správný panel
    if (tab === "inventar") {
        panelInv.style.display = "";
    } else if (tab === "nabidka") {
        panelNab.style.display = "";
        vykresliNabidku(); // Překresli obchod (aby byl aktuální)
    } else if (tab === "crafting") {
        panelCraft.style.display = "";
        vykresliCrafting(); // Překresli crafting (aby byl aktuální)
    }
}

// ============================================================
// CRAFTING – kombinování dvou předmětů v inventáři → nový předmět
// ============================================================

function vykresliCrafting(): void {
    const obsah = document.getElementById("crafting-obsah") as HTMLElement;
    obsah.innerHTML = ""; // Vymaž starý obsah

    // ID všech předmětů které hráč má v inventáři
    const vInventariIds = inventar.getPolozky().map(p => p.getId());

    // Projdi všechny recepty a vykresli je
    craftingRecepty.forEach(recept => {
        const maIngr1    = vInventariIds.includes(recept.ingredience1); // Má první ingredienci?
        const maIngr2    = vInventariIds.includes(recept.ingredience2); // Má druhou ingredienci?
        const jizVyroben = vInventariIds.includes(recept.vysledekId);   // Už vyrobil výsledek?
        const mozno      = maIngr1 && maIngr2 && !jizVyroben;           // Může craftit?

        // Najdi objekty ingrediencí a výsledku v mapě
        const ingr1    = vsechnyPredmetyMapa.get(recept.ingredience1);
        const ingr2    = vsechnyPredmetyMapa.get(recept.ingredience2);
        const vysledek = vsechnyPredmetyMapa.get(recept.vysledekId);

        // Pokud některý předmět neexistuje v mapě, přeskoč recept
        if (!ingr1 || !ingr2 || !vysledek) return;

        const radek = document.createElement("div");
        // CSS třídy: crafting-mozno = zelené pozadí, crafting-hotovo = průhledné
        radek.className = `crafting-radek ${mozno ? "crafting-mozno" : ""} ${jizVyroben ? "crafting-hotovo" : ""}`;
        radek.innerHTML = `
            <div class="crafting-ingredience">
                <span class="${maIngr1 ? "craft-ma" : "craft-nema"}">${getIkona(ingr1)} ${ingr1.getNazev()}</span>
                <span class="craft-plus">+</span>
                <span class="${maIngr2 ? "craft-ma" : "craft-nema"}">${getIkona(ingr2)} ${ingr2.getNazev()}</span>
            </div>
            <div class="crafting-sipka">▶</div>
            <div class="crafting-vysledek">
                ${getIkona(vysledek)} <strong>${vysledek.getNazev()}</strong>
                <span class="craft-rarity">[${vysledek.getRarity()}]</span>
            </div>
            <button class="btn-craft" data-id="${recept.id}" ${!mozno ? "disabled" : ""}>
                ${jizVyroben ? "✓ HOTOVO" : mozno ? "CRAFT" : "CHYBÍ"}
            </button>
        `;

        // Přidej akci na tlačítko CRAFT (jen pokud je možné craftit)
        if (mozno) {
            radek.querySelector(".btn-craft")!.addEventListener("click", () => {
                try {
                    // Odeber obě ingredience z inventáře
                    inventar.odeberPolozku(recept.ingredience1);
                    inventar.odeberPolozku(recept.ingredience2);
                    // Přidej výsledný předmět do inventáře
                    inventar.pridejPolozku(vysledek);
                    // Překresli UI
                    vykresliPostavu();
                    vykresliInventar();
                    vykresliCrafting();
                    zobrazChybu(`✨ Vytvořeno: ${vysledek.getNazev()}!`);
                } catch (err) {
                    zobrazChybu((err as Error).message);
                }
            });
        }

        obsah.appendChild(radek);
    });

    // Pokud nejsou žádné recepty (prázdná data), zobraz zprávu
    if (obsah.innerHTML === "") {
        obsah.innerHTML = `<div class="prazdny-detail" style="padding:16px">Žádné recepty k zobrazení.</div>`;
    }
}

// ============================================================
// EVENT LISTENERY – reakce na kliknutí v UI
// ============================================================

// Záložky (Inventář / Přidat / Craft) – přepínání panelů
document.querySelectorAll(".zalozka").forEach(z => {
    z.addEventListener("click", (e) => {
        prepniTab((e.currentTarget as HTMLElement).dataset.tab!);
    });
});

// Tlačítka filtru v obchodě (Vše / Zbraně / Brnění / Lektvary / Svitky)
document.querySelectorAll(".kategorie-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        // Odeber aktivní stav ze všech tlačítek filtru
        document.querySelectorAll(".kategorie-btn").forEach(b => b.classList.remove("aktivni"));
        (e.currentTarget as HTMLElement).classList.add("aktivni");
        aktivniFiltr = (e.currentTarget as HTMLElement).dataset.filtr!;
        prepniTab("nabidka"); // Přepni na záložku obchodu a překresli
    });
});

// Tlačítko průzkumu
document.getElementById("btn-pruzkum")!.addEventListener("click", pruzkum);

// Tlačítko restartu (na obrazovce smrti)
document.getElementById("btn-restart")!.addEventListener("click", restartHry);

// ============================================================
// INIT – spuštění aplikace, první vykreslení všeho
// ============================================================

vykresliInventar();  // Zobraz prázdný inventář
vykresliDetail();    // Zobraz prázdný detail
vykresliPostavu();   // Spočítej a zobraz staty
vykresliZlato();     // Zobraz počáteční zlaté
vykresliDen();      // Zobraz herní den

// Konzolový výpis všech předmětů s jejich efektivitou (pro ladění/školní účely)
const vsechnyPredmety: Polozka[] = [...zbrane, ...brneni, ...lektvary];
vsechnyPredmety.forEach(p => {
    console.log(`${p.getNazev()} | typ: ${p.constructor.name} | efektivita: ${p.vypocitejEfektivitu().toFixed(2)}`);
});
