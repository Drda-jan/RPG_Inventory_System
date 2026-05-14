//armor.ts
// Třída Brneni – potomek Polozka.
// "import" načte třídu Polozka z jiného souboru, abychom z ní mohli dědit.
import { Polozka } from "./polozka";
// Brneni dědí z Polozka a přidává vlastnosti obrana a typ.
export class Brneni extends Polozka {
    constructor(id, nazev, vaha, popis, zakladniCena, rarity, multiplikatorRarity, trvaniEfektu, obrana, typ, rychlost) { }
}
