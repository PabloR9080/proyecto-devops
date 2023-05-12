import { PrismaClient } from "@prisma/client";
import { db } from "../lib/db";

export default class AccountService{

    constructor(){
    }

    public async getAll(){
        try{
            const accounts = await db.account.findMany();
            return accounts;
        }catch(error){
            return 'An error occurred while retrieving accounts'
        }
    }

    public async createAccount(name: any, balance:any, createDate:any, lastLoginDate:any, cards:any, userId:any){
        const newAccount = await db.account.create({
            data: {
                name,
                balance,
                createDate: undefined,
                lastLoginDate,
                cards: undefined,
                userId,
              },
})
    }
 

}