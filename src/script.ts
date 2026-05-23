// script.ts
// Hlavní soubor – zde se vše propojí dohromady.
// Importujeme třídy a data ze všech ostatních souborů.

import { Polozka } from "./polozka.js";
import { Zbran } from "./weapon.js";
import { Brneni } from "./armor.js";
import { Lektvar} from "./potion.js";
import { Svitek } from "./scroll.js";
import { rawZbrane, rawBrneni, rawLektvary, rawSvitky } from "./data.js";

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

    public getMaxKapacita(): number { return this.maxKapacita; }

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
}

// Oživení dat – z číselníku (plain objekty) vytvoříme instance tříd.
const zbrane = rawZbrane.map(d =>
    new Zbran(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, 0, d.multiplikatorRarity, d.typ, d.poskozeni, d.rychlost)
);
const brneni = rawBrneni.map(d =>
    new Brneni(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, d.multiplikatorRarity, d.obrana, d.rychlost, d.typ)
);
const lektvary = rawLektvary.map(d =>
    new Lektvar(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, d.multiplikatorRarity, d.trvaniEfektu, d.efekt, d.typ)
);
const svitky = rawSvitky.map(d =>
    new Svitek(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, d.multiplikatorRarity, d.trvaniEfektu, d.efekt, d.typ)
);

// Vytvoříme inventář a naplníme ho.
const inventar = new Inventar(50);

function vykresliPostavu(): void {
    const polozky  = inventar.getPolozky();
    const celkVaha = inventar.spoctiCelkouVahu();

    // HP – roste s brnění (každý bod obrany = +2 HP, max 200)
    const bonusHP = polozky
        .filter(p => p instanceof Brneni)
        .reduce((sum, p) => sum + (p as Brneni).getObrana() * 2, 0);
    const hp = Math.min(200, 100 + bonusHP);

    // MP – roste s lektvary a svitky (každý = +5 MP, max 200)
    const bonusMP = polozky
        .filter(p => p instanceof Lektvar || p instanceof Svitek)
        .length * 5;
    const mp = Math.min(200, 80 + bonusMP);

    // STR – roste s combat power zbraní (max 999)
    const sila = polozky
        .filter(p => p instanceof Zbran)
        .reduce((sum, p) => sum + p.vypocitejEfektivitu(), 0);

    // SPD – klesá s váhou, brnění navíc ubírá (min 0, max 100)
    const penalizaceBrneni = polozky
        .filter(p => p instanceof Brneni)
        .reduce((sum, p) => sum + Math.abs((p as Brneni).getRychlost()), 0);
    const rychlost = Math.max(0, Math.round(100 - (celkVaha / inventar.getMaxKapacita()) * 60 - penalizaceBrneni));

    // aktualizace hodnot
    (document.getElementById("val-hp")  as HTMLElement).textContent = `${Math.round(hp)}`;
    (document.getElementById("val-mp")  as HTMLElement).textContent = `${Math.round(mp)}`;
    (document.getElementById("val-str") as HTMLElement).textContent = `${Math.round(sila)}`;
    (document.getElementById("val-spd") as HTMLElement).textContent = `${rychlost}`;

    // aktualizace pruhů
    (document.getElementById("bar-hp")  as HTMLElement).style.width = `${(hp / 200) * 100}%`;
    (document.getElementById("bar-mp")  as HTMLElement).style.width = `${(mp / 200) * 100}%`;
    (document.getElementById("bar-str") as HTMLElement).style.width = `${Math.min(100, (sila / 100) * 100)}%`;
    (document.getElementById("bar-spd") as HTMLElement).style.width = `${rychlost}%`;
}


// stav UI
let vybranId: string | null = null;
let aktivniFiltr = "vse";
const MAX_SLOTU = 20;

function getIkona(p: Polozka): string {
    if (p instanceof Zbran)   return "⚔️";
    if (p instanceof Brneni) return "👘";
    if (p instanceof Lektvar) return "🧪";
    return "📦";
}

function getTypClass(p: Polozka): string {
    if (p instanceof Zbran)   return "typ-zbran";
    if (p instanceof Brneni)  return "typ-brneni";
    if (p instanceof Lektvar) return "typ-lektvar";
    return "";
}

function zobrazChybu(zprava: string): void {
    const el = document.getElementById("chyba") as HTMLElement;
    el.textContent = zprava;
    el.style.display = "block";
    setTimeout(() => { el.style.display = "none"; }, 3000);
}

function vykresliInventar(): void {
    const mrizka   = document.getElementById("inventar-mrizka") as HTMLElement;
    const vahaText = document.getElementById("vaha-text") as HTMLElement;
    const vahaPruh = document.getElementById("vaha-pruh") as HTMLElement;
    const pocetEl  = document.getElementById("stat-pocet") as HTMLElement;

    const polozky  = inventar.getPolozky();
    const celkVaha = inventar.spoctiCelkouVahu();
    const maxKap   = inventar.getMaxKapacita();
    const procent  = Math.min(100, (celkVaha / maxKap) * 100);

    vahaText.textContent = `${celkVaha.toFixed(1)}/${maxKap}kg`;
    vahaPruh.style.width = `${procent}%`;
    vahaPruh.className   = "vaha-pruh" + (procent >= 90 ? " nebezpeci" : procent >= 65 ? " varovani" : "");
    pocetEl.textContent  = `${polozky.length}`;

    mrizka.innerHTML = "";

    polozky.forEach(p => {
        const slot = document.createElement("div");
        slot.className = `slot obsazeny ${p.getId() === vybranId ? "vybran" : ""}`;
        slot.title     = p.getNazev();
        slot.innerHTML = `${getIkona(p)}<span class="slot-pocet">${p.vypocitejEfektivitu().toFixed(0)}</span>`;
        slot.addEventListener("click", () => {
            vybranId = p.getId();
            vykresliInventar();
            vykresliDetail();
        });
        mrizka.appendChild(slot);
    });

    for (let i = polozky.length; i < MAX_SLOTU; i++) {
        const slot = document.createElement("div");
        slot.className = "slot";
        mrizka.appendChild(slot);
    }
}

function vykresliDetail(): void {
    const box     = document.getElementById("detail-box") as HTMLElement;
    const polozky = inventar.getPolozky();
    const p       = polozky.find(x => x.getId() === vybranId);

    if (!p) {
        box.innerHTML = `<div class="prazdny-detail">Vyber<br>předmět</div>`;
        return;
    }

    let extraInfo = "";
    if (p instanceof Zbran) {
        extraInfo = `<div class="detail-label">POŠKOZENÍ</div>
                     <div class="detail-hodnota">${p.getPoskozeni()}</div>
                     <div class="detail-label">RYCHLOST</div>
                     <div class="detail-hodnota">${p.getRychlost()}</div>`;
    } else if (p instanceof Brneni) {
        extraInfo = `<div class="detail-label">OBRANA</div>
                     <div class="detail-hodnota">${p.getObrana()}</div>
                     <div class="detail-label">RYCHLOST</div>
                     <div class="detail-hodnota">${p.getRychlost()}</div>`;
    } else if (p instanceof Lektvar) {
        extraInfo = `<div class="detail-label">EFEKT</div>
                     <div class="detail-hodnota">${p.getEfekt()}</div>`;
    }

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

    document.getElementById("btn-odeber-vybrany")!.addEventListener("click", () => {
        inventar.odeberPolozku(vybranId!);
        vybranId = null;
        vykresliInventar();
        vykresliNabidku();
        vykresliDetail();
        vykresliPostavu
    });
}

function vykresliNabidku(): void {
    const seznam     = document.getElementById("nabidka-seznam") as HTMLElement;
    seznam.innerHTML = "";

    const vsechny: Polozka[] = [...zbrane, ...brneni, ...lektvary, ...svitky];
    const vInventari = inventar.getPolozky().map(p => p.getId());

    const filtrovane = vsechny.filter(p => {
        if (aktivniFiltr === "vse")     return true;
        if (aktivniFiltr === "zbran")   return p instanceof Zbran;
        if (aktivniFiltr === "brneni")  return p instanceof Brneni;
        if (aktivniFiltr === "lektvar") return p instanceof Lektvar;
        if (aktivniFiltr === "svitek") return p instanceof Svitek;
        return true;
    });

    filtrovane.forEach(p => {
        const jizPridan = vInventari.includes(p.getId());
        const radek     = document.createElement("div");
        radek.className = `nabidka-radek ${getTypClass(p)} ${jizPridan ? "uz-pridano" : ""}`;
        radek.innerHTML = `
            <span class="nabidka-ikona">${getIkona(p)}</span>
            <span class="nabidka-nazev">${p.getNazev()}</span>
            <span class="nabidka-vaha">${p.getVaha()}kg</span>
            <button class="btn-plus" data-id="${p.getId()}" ${jizPridan ? "disabled" : ""}>${jizPridan ? "✓" : "+"}</button>
        `;

        if (!jizPridan) {
            radek.querySelector(".btn-plus")!.addEventListener("click", () => {
                try {
                    inventar.pridejPolozku(p);
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

function prepniTab(tab: string): void {
    const panelInv = document.getElementById("panel-inventar") as HTMLElement;
    const panelNab = document.getElementById("panel-nabidka")  as HTMLElement;

    document.querySelectorAll(".zalozka").forEach(z => z.classList.remove("aktivni"));
    document.querySelector(`[data-tab="${tab}"]`)?.classList.add("aktivni");

    if (tab === "inventar") {
        panelInv.style.display = "";
        panelNab.style.display = "none";
    } else {
        panelInv.style.display = "none";
        panelNab.style.display = "";
        vykresliNabidku();
    }
}

document.querySelectorAll(".zalozka").forEach(z => {
    z.addEventListener("click", (e) => {
        prepniTab((e.currentTarget as HTMLElement).dataset.tab!);
    });
});

document.querySelectorAll(".kategorie-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        document.querySelectorAll(".kategorie-btn").forEach(b => b.classList.remove("aktivni"));
        (e.currentTarget as HTMLElement).classList.add("aktivni");
        aktivniFiltr = (e.currentTarget as HTMLElement).dataset.filtr!;
        prepniTab("nabidka");
    });
});

vykresliInventar();
vykresliDetail();


// Testování polymorfismu – projdeme všechny předměty a vypíšeme jejich efektivitu.
// Každý předmět zavolá svou vlastní verzi vypocitejEfektivitu() – to je polymorfismus.
const vsechnyPredmety: Polozka[] = [...zbrane, ...brneni, ...lektvary];

vsechnyPredmety.forEach(p => {
    console.log(`${p.getNazev()} | typ: ${p.constructor.name} | efektivita: ${p.vypocitejEfektivitu().toFixed(2)}`);
});     

console.log("zalozky:", document.querySelectorAll(".zalozka").length);
console.log("kategorie:", document.querySelectorAll(".kategorie-btn").length);
console.log("panel-nabidka:", document.getElementById("panel-nabidka"));

vykresliPostavu