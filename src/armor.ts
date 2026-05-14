//armor.ts
// Třída Brneni – potomek Polozka.
// "import" načte třídu Polozka z jiného souboru, abychom z ní mohli dědit.

import { Polozka } from "./polozka";

// Brneni dědí z Polozka a přidává vlastnosti obrana a typ.
export class Brneni extends Polozka {
    private readonly obrana: number;
    private readonly typ: string;
    private readonly rychlost: number;

    constructor(id: string, nazev: string, vaha: number, popis: string, zakladniCena: number, rarity: string, multiplikatorRarity: number, trvaniEfektu: number, obrana: number, typ: string, rychlost: number) {