import Card from "./card";

export default interface Account{
    id: number;
    name: string;
    type: string;
    balance: number;
    createDate: string;
    lastUpdateDate: string;
    cards: Card[];
}
