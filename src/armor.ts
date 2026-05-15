//armor.ts
// Třída Brneni – potomek Polozka.
// "import" načte třídu Polozka z jiného souboru, abychom z ní mohli dědit.

import { Polozka } from "./polozka";

// Brneni dědí z Polozka a přidává vlastnosti obrana a typ.
export class Brneni extends Polozka {
    private readonly obrana: number;
    private readonly typ: string;
    private readonly rychlost: number;

    constructor(id: string, nazev: string, vaha: number, popis: string, zakladniCena: number, rarity: string, multiplikatorRarity: number, obrana: number, rychlost: number, typ: string) {
        super(id, nazev, vaha, popis, zakladniCena, rarity, 0, multiplikatorRarity);

        if (obrana<= 0) throw new Error("Obrana musí být kladné číslo.");
        this.obrana = obrana;
        this.rychlost = rychlost;
        this.typ = typ; 

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

    //Efektivita = obrana/vaha
    //lehke brneni s vysokou obranou dostane nejlepsi skore

    public vypocitejEfektivitu()  : number {
        return this.obrana / this.getVaha();
    }
}