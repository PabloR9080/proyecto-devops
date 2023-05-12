export default interface Transaction {
    id: string;
    type: string;
    amount: number;
    description: string;
    cardOrigin: string;
    transactionDate: string;
}