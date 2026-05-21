// script.ts
// Hlavní soubor – zde se vše propojí dohromady.
// Importujeme třídy a data ze všech ostatních souborů.
import { Zbran } from "./weapon.js";
import { Brneni } from "./armor.js";
import { lektvar } from "./potion.js";
import { rawZbrane, rawBrneni, rawLektvary } from "./data.js";
// Inventar drží seznam všech předmětů a hlídá, aby postava nebyla přetížená.
// Pole "polozky" může obsahovat Zbran, Brneni i Lektvar najednou –
// všechny mají společný typ Polozka, takže je lze ukládat dohromady.
class Inventar {
    constructor(maxKapacita = 50) {
        this.polozky = [];
        if (maxKapacita <= 0)
            throw new Error(`maxKapacita musí být kladná, obdrženo: ${maxKapacita}`);
        this.maxKapacita = maxKapacita;
    }
    // Přidá předmět do inventáře, ale jen pokud se vejde – jinak vyhodí chybu.
    pridejPolozku(polozka) {
        const novaVaha = this.spoctiCelkouVahu() + polozka.getVaha();
        if (novaVaha > this.maxKapacita) {
            throw new Error(`"${polozka.getNazev()}" by překročilo kapacitu! (${this.spoctiCelkouVahu().toFixed(1)} + ${polozka.getVaha()} > ${this.maxKapacita} kg)`);
        }
        this.polozky.push(polozka);
    }
    // Odebere předmět podle ID. Pokud takové ID v inventáři není, vyhodí chybu.
    odeberPolozku(id) {
        const idx = this.polozky.findIndex(p => p.getId() === id);
        if (idx === -1)
            throw new Error(`Položka s id "${id}" nebyla nalezena.`);
        this.polozky.splice(idx, 1);
    }
    // Projde všechny předměty a sečte jejich váhy dohromady.
    spoctiCelkouVahu() {
        return this.polozky.reduce((sum, p) => sum + p.getVaha(), 0);
    }
    // Vrátí kopii pole – aby nikdo zvenku nemohl pole přímo měnit bez použití našich metod.
    getPolozky() { return [...this.polozky]; }
    getMaxKapacita() { return this.maxKapacita; }
    // Polymorfismus v praxi – voláme vypocitejEfektivitu() na každém předmětu.
    // JavaScript sám za běhu pozná, jestli jde o Zbran, Brneni nebo Lektvar,
    // a zavolá správnou verzi metody – každá třída má svůj vlastní vzorec.
    getEfektivitaVsech() {
        return this.polozky.map(polozka => ({
            nazev: polozka.getNazev(),
            typ: polozka.constructor.name,
            efektivita: polozka.vypocitejEfektivitu()
        }));
    }
}
// Oživení dat – z číselníku (plain objekty) vytvoříme instance tříd.
const zbrane = rawZbrane.map(d => new Zbran(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, 0, d.multiplikatorRarity, d.typ, d.poskozeni, d.rychlost));
const brneni = rawBrneni.map(d => new Brneni(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, d.multiplikatorRarity, d.obrana, d.rychlost, d.typ));
const lektvary = rawLektvary.map(d => new lektvar(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, d.multiplikatorRarity, d.trvaniEfektu, d.efekt, d.typ));
// Vytvoříme inventář a naplníme ho.
const inventar = new Inventar(50);
// stav UI
let vybranId = null;
let aktivniFiltr = "vse";
const MAX_SLOTU = 20;
function getIkona(p) {
    if (p instanceof Zbran)
        return "⚔️";
    if (p instanceof Brneni)
        return "🧥";
    if (p instanceof lektvar)
        return "🧪";
    return "📦";
}
function getTypClass(p) {
    if (p instanceof Zbran)
        return "typ-zbran";
    if (p instanceof Brneni)
        return "typ-brneni";
    if (p instanceof lektvar)
        return "typ-lektvar";
    return "";
}
function zobrazChybu(zprava) {
    const el = document.getElementById("chyba");
    el.textContent = zprava;
    el.style.display = "block";
    setTimeout(() => { el.style.display = "none"; }, 3000);
}
function vykresliInventar() {
    const mrizka = document.getElementById("inventar-mrizka");
    const vahaText = document.getElementById("vaha-text");
    const vahaPruh = document.getElementById("vaha-pruh");
    const pocetEl = document.getElementById("stat-pocet");
    const polozky = inventar.getPolozky();
    const celkVaha = inventar.spoctiCelkouVahu();
    const maxKap = inventar.getMaxKapacita();
    const procent = Math.min(100, (celkVaha / maxKap) * 100);
    vahaText.textContent = `${celkVaha.toFixed(1)}/${maxKap}kg`;
    vahaPruh.style.width = `${procent}%`;
    vahaPruh.className = "vaha-pruh" + (procent >= 90 ? " nebezpeci" : procent >= 65 ? " varovani" : "");
    pocetEl.textContent = `${polozky.length}`;
    mrizka.innerHTML = "";
    polozky.forEach(p => {
        const slot = document.createElement("div");
        slot.className = `slot obsazeny ${p.getId() === vybranId ? "vybran" : ""}`;
        slot.title = p.getNazev();
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
function vykresliDetail() {
    const box = document.getElementById("detail-box");
    const polozky = inventar.getPolozky();
    const p = polozky.find(x => x.getId() === vybranId);
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
    }
    else if (p instanceof Brneni) {
        extraInfo = `<div class="detail-label">OBRANA</div>
                     <div class="detail-hodnota">${p.getObrana()}</div>
                     <div class="detail-label">RYCHLOST</div>
                     <div class="detail-hodnota">${p.getRychlost()}</div>`;
    }
    else if (p instanceof lektvar) {
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
    document.getElementById("btn-odeber-vybrany").addEventListener("click", () => {
        inventar.odeberPolozku(vybranId);
        vybranId = null;
        vykresliInventar();
        vykresliNabidku();
        vykresliDetail();
    });
}
function vykresliNabidku() {
    const seznam = document.getElementById("nabidka-seznam");
    seznam.innerHTML = "";
    const vsechny = [...zbrane, ...brneni, ...lektvary];
    const vInventari = inventar.getPolozky().map(p => p.getId());
    const filtrovane = vsechny.filter(p => {
        if (aktivniFiltr === "vse")
            return true;
        if (aktivniFiltr === "zbran")
            return p instanceof Zbran;
        if (aktivniFiltr === "brneni")
            return p instanceof Brneni;
        if (aktivniFiltr === "lektvar")
            return p instanceof lektvar;
        return true;
    });
    filtrovane.forEach(p => {
        const jizPridan = vInventari.includes(p.getId());
        const radek = document.createElement("div");
        radek.className = `nabidka-radek ${getTypClass(p)} ${jizPridan ? "uz-pridano" : ""}`;
        radek.innerHTML = `
            <span class="nabidka-ikona">${getIkona(p)}</span>
            <span class="nabidka-nazev">${p.getNazev()}</span>
            <span class="nabidka-vaha">${p.getVaha()}kg</span>
            <button class="btn-plus" data-id="${p.getId()}" ${jizPridan ? "disabled" : ""}>${jizPridan ? "✓" : "+"}</button>
        `;
        if (!jizPridan) {
            radek.querySelector(".btn-plus").addEventListener("click", () => {
                try {
                    inventar.pridejPolozku(p);
                    vykresliInventar();
                    vykresliNabidku();
                }
                catch (err) {
                    zobrazChybu(err.message);
                }
            });
        }
        seznam.appendChild(radek);
    });
}
function prepniTab(tab) {
    var _a;
    const panelInv = document.getElementById("panel-inventar");
    const panelNab = document.getElementById("panel-nabidka");
    document.querySelectorAll(".zalozka").forEach(z => z.classList.remove("aktivni"));
    (_a = document.querySelector(`[data-tab="${tab}"]`)) === null || _a === void 0 ? void 0 : _a.classList.add("aktivni");
    if (tab === "inventar") {
        panelInv.style.display = "";
        panelNab.style.display = "none";
    }
    else {
        panelInv.style.display = "none";
        panelNab.style.display = "";
        vykresliNabidku();
    }
}
document.querySelectorAll(".zalozka").forEach(z => {
    z.addEventListener("click", (e) => {
        prepniTab(e.currentTarget.dataset.tab);
    });
});
document.querySelectorAll(".kategorie-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        document.querySelectorAll(".kategorie-btn").forEach(b => b.classList.remove("aktivni"));
        e.currentTarget.classList.add("aktivni");
        aktivniFiltr = e.currentTarget.dataset.filtr;
        prepniTab("nabidka");
    });
});
vykresliInventar();
vykresliDetail();
// Testování polymorfismu – projdeme všechny předměty a vypíšeme jejich efektivitu.
// Každý předmět zavolá svou vlastní verzi vypocitejEfektivitu() – to je polymorfismus.
const vsechnyPredmety = [...zbrane, ...brneni, ...lektvary];
vsechnyPredmety.forEach(p => {
    console.log(`${p.getNazev()} | typ: ${p.constructor.name} | efektivita: ${p.vypocitejEfektivitu().toFixed(2)}`);
});
console.log("zalozky:", document.querySelectorAll(".zalozka").length);
console.log("kategorie:", document.querySelectorAll(".kategorie-btn").length);
console.log("panel-nabidka:", document.getElementById("panel-nabidka"));
