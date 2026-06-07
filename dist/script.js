// script.ts
// Hlavní soubor celé aplikace.
// Tady se propojují všechny třídy, data, logika UI a události.
import { Zbran } from "./weapon.js"; // Zbraně (meč, dýka, kladivo...)
import { Brneni } from "./armor.js"; // Brnění (kožená zbroj, plášť...)
import { Lektvar } from "./potion.js"; // Lektvary (zdraví, síla...)
import { Svitek } from "./scroll.js"; // Svitky (oheň, blesk...)
import { rawZbrane, rawBrneni, rawLektvary, rawSvitky, // Základní předměty z obchodu
craftingRecepty, // Recepty pro crafting
rawZbraneCraft, rawBrneniCraft, rawLektvaryCraft // Předměty dostupné jen přes crafting
 } from "./data.js";
// ============================================================
// TŘÍDA INVENTÁŘ – spravuje seznam předmětů hráče
// ============================================================
class Inventar {
    constructor(maxKapacita = 50) {
        this.polozky = []; // Pole všech předmětů v inventáři
        // Kontrola že kapacita dává smysl
        if (maxKapacita <= 0)
            throw new Error(`maxKapacita musí být kladná, obdrženo: ${maxKapacita}`);
        this.maxKapacita = maxKapacita;
    }
    // Přidá předmět do inventáře – hodí chybu pokud by přetížil nosnost
    pridejPolozku(polozka) {
        const novaVaha = this.spoctiCelkouVahu() + polozka.getVaha();
        if (novaVaha > this.maxKapacita) {
            throw new Error(`"${polozka.getNazev()}" by překročilo kapacitu! (${this.spoctiCelkouVahu().toFixed(1)} + ${polozka.getVaha()} > ${this.maxKapacita} kg)`);
        }
        this.polozky.push(polozka);
    }
    // Odebere předmět podle jeho ID – hodí chybu pokud předmět neexistuje
    odeberPolozku(id) {
        const idx = this.polozky.findIndex(p => p.getId() === id);
        if (idx === -1)
            throw new Error(`Položka s id "${id}" nebyla nalezena.`);
        this.polozky.splice(idx, 1);
    }
    // Sečte váhu všech předmětů v inventáři
    spoctiCelkouVahu() {
        return this.polozky.reduce((sum, p) => sum + p.getVaha(), 0);
    }
    // Vrátí kopii pole předmětů (aby nešlo pole přímo měnit zvenku)
    getPolozky() { return [...this.polozky]; }
    // Vrátí maximální nosnost
    getMaxKapacita() { return this.maxKapacita; }
    // Vrátí efektivitu všech předmětů – používáme pro konzolový výpis
    getEfektivitaVsech() {
        return this.polozky.map(polozka => ({
            nazev: polozka.getNazev(),
            typ: polozka.constructor.name,
            efektivita: polozka.vypocitejEfektivitu()
        }));
    }
}
// ============================================================
// OŽIVENÍ DAT – převod surových dat na instance tříd
// ============================================================
const zbrane = rawZbrane.map(d => new Zbran(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, 0, d.multiplikatorRarity, d.typ, d.poskozeni, d.rychlost));
const brneni = rawBrneni.map(d => new Brneni(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, d.multiplikatorRarity, d.obrana, d.rychlost, d.typ));
const lektvary = rawLektvary.map(d => new Lektvar(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, d.multiplikatorRarity, d.trvaniEfektu, d.efekt, d.typ));
const svitky = rawSvitky.map(d => new Svitek(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, d.multiplikatorRarity, d.trvaniEfektu, d.efekt, d.typ));
const zbraneCraft = rawZbraneCraft.map(d => new Zbran(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, 0, d.multiplikatorRarity, d.typ, d.poskozeni, d.rychlost));
const brneniCraft = rawBrneniCraft.map(d => new Brneni(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, d.multiplikatorRarity, d.obrana, d.rychlost, d.typ));
const lektvaryCraft = rawLektvaryCraft.map(d => new Lektvar(d.id, d.nazev, d.vaha, d.popis, 0, d.rarity, d.multiplikatorRarity, d.trvaniEfektu, d.efekt, d.typ));
// Mapa všech předmětů (ID → objekt) – pro rychlé vyhledání v craftingu
const vsechnyPredmetyMapa = new Map();
[...zbrane, ...brneni, ...lektvary, ...svitky, ...zbraneCraft, ...brneniCraft, ...lektvaryCraft]
    .forEach(p => vsechnyPredmetyMapa.set(p.getId(), p));
// Vytvoření inventáře s nosností 50 kg
const inventar = new Inventar(50);
// ============================================================
// ZLATO – herní měna
// ============================================================
let zlato = 100;
let aktualniHp = 100;
let herniDen = 1;
function vykresliDen() {
    document.getElementById("den-text").textContent = `${herniDen}`;
}
function getCena(p) {
    switch (p.getRarity()) {
        case "legendární": return 500;
        case "vzácná": return 200;
        case "neobvyklá": return 75;
        default: return 20;
    }
}
function vykresliZlato() {
    document.getElementById("zlato-text").textContent = `${zlato}`;
}
// ============================================================
// SMRT A RESTART
// ============================================================
function zobrazSmrt() {
    const okno = document.getElementById("smrt-okno");
    okno.style.display = "flex";
}
function restartHry() {
    aktualniHp = 100;
    zlato = 100;
    inventar.getPolozky().forEach(p => inventar.odeberPolozku(p.getId()));
    const okno = document.getElementById("smrt-okno");
    okno.style.display = "none";
    vykresliInventar();
    vykresliDetail();
    vykresliPostavu();
    vykresliZlato();
    herniDen = 1;
    vykresliDen();
}
// ============================================================
// PRŮZKUM
// ============================================================
function pruzkum() {
    var _a;
    const btn = document.getElementById("btn-pruzkum");
    const spd = parseInt(((_a = document.getElementById("val-spd").textContent) === null || _a === void 0 ? void 0 : _a.split("/")[0]) || "50");
    const sance = Math.random() * 100;
    let odmenaMince = 0;
    let zprava = "";
    if (sance < 10) {
        const zraneni = Math.floor(15 + Math.random() * 20);
        aktualniHp = Math.max(0, aktualniHp - zraneni);
        zprava = `Byl jsi přepaden! -${zraneni} HP`;
        vykresliPostavu();
    }
    else if (sance < 25) {
        const zraneni = Math.floor(5 + Math.random() * 10);
        aktualniHp = Math.max(0, aktualniHp - zraneni);
        odmenaMince = Math.floor(10 + Math.random() * 15);
        zprava = `Lehce zraněn (-${zraneni} HP) ale našel jsi ${odmenaMince} zlatých!`;
        vykresliPostavu();
    }
    else if (sance < 55) {
        odmenaMince = Math.floor(10 + Math.random() * 20);
        zprava = `Našel jsi ${odmenaMince} zlatých!`;
    }
    else if (sance < 80) {
        odmenaMince = Math.floor(30 + (spd / 100) * 30);
        zprava = `Dobrý nález! +${odmenaMince} zlatých.`;
    }
    else {
        odmenaMince = Math.floor(60 + (spd / 100) * 60);
        zprava = `Skvělý nález! +${odmenaMince} zlatých!`;
    }
    zlato += odmenaMince;
    vykresliZlato();
    zobrazChybu(zprava);
    btn.disabled = true;
    btn.textContent = "⏳ 5s";
    let cas = 5;
    const interval = setInterval(() => {
        cas--;
        btn.textContent = `⏳ ${cas}s`;
        if (cas <= 0) {
            clearInterval(interval);
            btn.disabled = false;
            btn.textContent = "⚔ PRŮZKUM";
        }
    }, 1000);
    herniDen++;
    vykresliDen();
}
// ============================================================
// STATY POSTAVY
// ============================================================
function vykresliPostavu() {
    const polozky = inventar.getPolozky();
    const celkVaha = inventar.spoctiCelkouVahu();
    const bonusHP = polozky
        .filter(p => p instanceof Brneni)
        .reduce((sum, p) => sum + p.getObrana() * 2, 0);
    const maxHp = 100 + bonusHP;
    if (aktualniHp > maxHp)
        aktualniHp = maxHp;
    const sila = polozky
        .filter(p => p instanceof Zbran)
        .reduce((sum, p) => sum + p.vypocitejEfektivitu(), 0);
    const penalizaceBrneni = polozky
        .filter(p => p instanceof Brneni)
        .reduce((sum, p) => sum + Math.abs(p.getRychlost()), 0);
    const rychlost = Math.max(0, Math.round(100 - (celkVaha / inventar.getMaxKapacita()) * 60 - penalizaceBrneni));
    document.getElementById("val-hp").textContent = `${aktualniHp}/${maxHp}`;
    document.getElementById("val-mp").textContent = `80`;
    document.getElementById("val-str").textContent = `${Math.round(sila)}`;
    document.getElementById("val-spd").textContent = `${rychlost}`;
    document.getElementById("bar-hp").style.width = `${(aktualniHp / maxHp) * 100}%`;
    document.getElementById("bar-mp").style.width = `100%`;
    document.getElementById("bar-str").style.width = `${Math.min(100, (sila / 100) * 100)}%`;
    document.getElementById("bar-spd").style.width = `${rychlost}%`;
    const hpBar = document.getElementById("bar-hp");
    const hpProcent = (aktualniHp / maxHp) * 100;
    hpBar.className = "stat-bar hp-bar"
        + (hpProcent <= 20 ? " critical" : hpProcent <= 50 ? " low" : "");
    if (aktualniHp <= 0) {
        zobrazSmrt();
    }
}
// ============================================================
// STAV UI
// ============================================================
let vybranId = null;
let aktivniFiltr = "vse";
const MAX_SLOTU = 20;
function getIkona(p) {
    if (p instanceof Zbran)
        return "⚔️";
    if (p instanceof Brneni)
        return "👘";
    if (p instanceof Lektvar)
        return "🧪";
    if (p instanceof Svitek)
        return "📜";
    return "📦";
}
function getTypClass(p) {
    if (p instanceof Zbran)
        return "typ-zbran";
    if (p instanceof Brneni)
        return "typ-brneni";
    if (p instanceof Lektvar)
        return "typ-lektvar";
    return "";
}
function zobrazChybu(zprava) {
    const el = document.getElementById("chyba");
    el.textContent = zprava;
    el.style.display = "block";
    setTimeout(() => { el.style.display = "none"; }, 3000);
}
// ============================================================
// VYKRESLENÍ INVENTÁŘE
// ============================================================
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
// ============================================================
// VYKRESLENÍ DETAILU
// ============================================================
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
        extraInfo = `
            <div class="detail-label">POŠKOZENÍ</div>
            <div class="detail-hodnota">${p.getPoskozeni()}</div>
            <div class="detail-label">RYCHLOST</div>
            <div class="detail-hodnota">${p.getRychlost()}</div>`;
    }
    else if (p instanceof Brneni) {
        extraInfo = `
            <div class="detail-label">OBRANA</div>
            <div class="detail-hodnota">${p.getObrana()}</div>
            <div class="detail-label">RYCHLOST</div>
            <div class="detail-hodnota">${p.getRychlost()}</div>`;
    }
    else if (p instanceof Lektvar) {
        extraInfo = `
            <div class="detail-label">EFEKT</div>
            <div class="detail-hodnota">${p.getEfekt()}</div>
            <button class="btn-pouzit" id="btn-pouzit-lektvar">⚗ POUŽÍT</button>`;
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
        vykresliPostavu();
    });
    const btnPouzit = document.getElementById("btn-pouzit-lektvar");
    if (btnPouzit) {
        btnPouzit.addEventListener("click", () => {
            const nazev = p.getNazev();
            const efekt = p.getEfekt();
            if (efekt === "obnova zdraví") {
                const polozkyAkt = inventar.getPolozky();
                const bonusHP = polozkyAkt
                    .filter(x => x instanceof Brneni)
                    .reduce((sum, x) => sum + x.getObrana() * 2, 0);
                const maxHp = 100 + bonusHP;
                aktualniHp = Math.min(maxHp, aktualniHp + 50);
            }
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
// VYKRESLENÍ NABÍDKY (OBCHOD)
// ============================================================
function vykresliNabidku() {
    const seznam = document.getElementById("nabidka-seznam");
    seznam.innerHTML = "";
    const vsechny = [...zbrane, ...brneni, ...lektvary, ...svitky];
    const vInventari = inventar.getPolozky().map(p => p.getId());
    const filtrovane = vsechny.filter(p => {
        if (aktivniFiltr === "vse")
            return true;
        if (aktivniFiltr === "zbran")
            return p instanceof Zbran;
        if (aktivniFiltr === "brneni")
            return p instanceof Brneni;
        if (aktivniFiltr === "lektvar")
            return p instanceof Lektvar;
        if (aktivniFiltr === "svitek")
            return p instanceof Svitek;
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
            <span class="cena-text">🪙${getCena(p)}</span>
            <button class="btn-plus" data-id="${p.getId()}" ${jizPridan ? "disabled" : ""}>
                ${jizPridan ? "✓" : "+"}
            </button>
        `;
        if (!jizPridan) {
            radek.querySelector(".btn-plus").addEventListener("click", () => {
                try {
                    if (zlato < getCena(p)) {
                        zobrazChybu("Nemáš dost zlatých!");
                        return;
                    }
                    zlato -= getCena(p);
                    inventar.pridejPolozku(p);
                    vykresliZlato();
                    vykresliPostavu();
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
// ============================================================
// PŘEPÍNÁNÍ ZÁLOŽEK – OPRAVENO
// Místo style.display používáme třídu "skryty" – konzistentní
// s CSS a HTML, kde panely začínají se třídou "skryty"
// ============================================================
function prepniTab(tab) {
    var _a;
    const panelInv = document.getElementById("panel-inventar");
    const panelNab = document.getElementById("panel-nabidka");
    const panelCraft = document.getElementById("panel-crafting");
    // Odeber třídu "aktivni" ze všech záložek a přidej ji na tu kliknutou
    document.querySelectorAll(".zalozka").forEach(z => z.classList.remove("aktivni"));
    (_a = document.querySelector(`[data-tab="${tab}"]`)) === null || _a === void 0 ? void 0 : _a.classList.add("aktivni");
    // Vymaž případné inline display styly zanechané starým kódem
    panelInv.style.display = "";
    panelNab.style.display = "";
    panelCraft.style.display = "";
    // Skryj všechny panely přes CSS třídu (ne inline style!)
    panelInv.classList.add("skryty");
    panelNab.classList.add("skryty");
    panelCraft.classList.add("skryty");
    // Zobraz pouze správný panel odebráním třídy "skryty"
    if (tab === "inventar") {
        panelInv.classList.remove("skryty");
    }
    else if (tab === "nabidka") {
        panelNab.classList.remove("skryty");
        vykresliNabidku();
    }
    else if (tab === "crafting") {
        panelCraft.classList.remove("skryty");
        vykresliCrafting();
    }
}
// ============================================================
// CRAFTING
// ============================================================
function vykresliCrafting() {
    const obsah = document.getElementById("crafting-obsah");
    obsah.innerHTML = "";
    const vInventariIds = inventar.getPolozky().map(p => p.getId());
    craftingRecepty.forEach(recept => {
        const maIngr1 = vInventariIds.includes(recept.ingredience1);
        const maIngr2 = vInventariIds.includes(recept.ingredience2);
        const jizVyroben = vInventariIds.includes(recept.vysledekId);
        const mozno = maIngr1 && maIngr2 && !jizVyroben;
        const ingr1 = vsechnyPredmetyMapa.get(recept.ingredience1);
        const ingr2 = vsechnyPredmetyMapa.get(recept.ingredience2);
        const vysledek = vsechnyPredmetyMapa.get(recept.vysledekId);
        if (!ingr1 || !ingr2 || !vysledek)
            return;
        const radek = document.createElement("div");
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
        if (mozno) {
            radek.querySelector(".btn-craft").addEventListener("click", () => {
                try {
                    inventar.odeberPolozku(recept.ingredience1);
                    inventar.odeberPolozku(recept.ingredience2);
                    inventar.pridejPolozku(vysledek);
                    vykresliPostavu();
                    vykresliInventar();
                    vykresliCrafting();
                    zobrazChybu(`✨ Vytvořeno: ${vysledek.getNazev()}!`);
                }
                catch (err) {
                    zobrazChybu(err.message);
                }
            });
        }
        obsah.appendChild(radek);
    });
    if (obsah.innerHTML === "") {
        obsah.innerHTML = `<div class="prazdny-detail" style="padding:16px">Žádné recepty k zobrazení.</div>`;
    }
}
// ============================================================
// EVENT LISTENERY
// ============================================================
// Záložky (Inventář / Obchod / Craft)
document.querySelectorAll(".zalozka").forEach(z => {
    z.addEventListener("click", (e) => {
        prepniTab(e.currentTarget.dataset.tab);
    });
});
// Tlačítka filtru kategorií v obchodě
document.querySelectorAll(".kategorie-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        document.querySelectorAll(".kategorie-btn").forEach(b => b.classList.remove("aktivni"));
        e.currentTarget.classList.add("aktivni");
        aktivniFiltr = e.currentTarget.dataset.filtr;
        prepniTab("nabidka");
    });
});
// Tlačítko průzkumu
document.getElementById("btn-pruzkum").addEventListener("click", pruzkum);
// Tlačítko restartu
document.getElementById("btn-restart").addEventListener("click", restartHry);
// ============================================================
// INIT – první vykreslení aplikace
// ============================================================
vykresliInventar();
vykresliDetail();
vykresliPostavu();
vykresliZlato();
vykresliDen();
prepniTab("inventar"); // Zajistí správné zobrazení první záložky přes classList
