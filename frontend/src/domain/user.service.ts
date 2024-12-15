import { BehaviorSubject } from "rxjs";
import { User } from "./user";
import { inject, Injectable } from "@angular/core";
import { CLIENT } from "../providers/api.config";
import { Account } from "appwrite";

@Injectable({providedIn: "root"})
export class UserService {

    private readonly client = inject(CLIENT);
    private account: Account = new Account(this.client);

    private user = new BehaviorSubject<User | null>(null);
    public readonly user$ = this.user.asObservable();

    async checkUser(){
        try{
            const u = await this.account.get()
            this.user.next({
                id: u.$id,
                email: u.email,
                name: u.name,
            })
            return true;
        }
        catch(e){
            return false;
        }
    }

    async login(email: string, password: string){
        await this.account.createEmailPasswordSession(email, password);
        const user = await this.account.get();
        this.user.next({
            email: user.email,
            id: user.$id,
            name: user.name,
        });
    }

    async logout(){
        const session = await this.account.getSession('current');
        await this.account.deleteSession(session.$id);
        window.location.href = "";
    }
    


}