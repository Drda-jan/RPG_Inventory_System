//armor.ts
// Třída Brneni – potomek Polozka.
// "import" načte třídu Polozka z jiného souboru, abychom z ní mohli dědit.
import { Polozka } from "./polozka.js";
// Brneni dědí z Polozka a přidává vlastnosti obrana a typ.
export class Brneni extends Polozka {
    constructor(id, nazev, vaha, popis, zakladniCena, rarity, multiplikatorRarity, obrana, rychlost, typ) {
        super(id, nazev, vaha, popis, zakladniCena, rarity, 0, multiplikatorRarity);
        if (obrana <= 0)
            throw new Error("Obrana musí být kladné číslo.");
        this.obrana = obrana;
        this.rychlost = rychlost;
        this.typ = typ;
    }
    getObrana() {
        return this.obrana;
    }
    getRychlost() {
        return this.rychlost;
    }
    getTyp() {
        return this.typ;
    }
    //Efektivita = obrana/vaha
    //lehke brneni s vysokou obranou dostane nejlepsi skore
    vypocitejEfektivitu() {
        return this.obrana / this.getVaha();
    }
}
