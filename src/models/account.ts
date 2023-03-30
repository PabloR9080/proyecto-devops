import Card from "./card";

export default interface Account{
    id: string;
    name: string;
    balance: number;
    createDate: string;
    lastUpdateDate: string;
    cards?: Card[];
}
