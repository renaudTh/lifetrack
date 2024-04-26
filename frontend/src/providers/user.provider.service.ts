import { Inject, Injectable } from "@angular/core";
import { SupabaseClient, UserResponse } from "@supabase/supabase-js";
import { Observable, from, map, tap, throwError } from "rxjs";
import { User } from "../domain/user";


@Injectable({ providedIn: 'root' })
export class UserProviderService {


    constructor(@Inject("SUPABASE_CLIENT") private _supabase: SupabaseClient) { }
    private user: User | null = null;

    login(email: string, password: string): Observable<User> {
        return from(this._supabase.auth.signInWithPassword({
            email,
            password
        })).pipe(
            map((response) => {
                if (response.error !== null|| response.data === null) {
                    throw response.error
                }
                return response.data.user;
            }),
            map((user) => {
                if (!user.email) {
                    throw throwError(() => new Error("No email found"))
                }
                this.user = {
                    email: user.email,
                    id: user.id
                }
                return this.user;
            })
        )
    }
    authenticated$(): Observable<boolean> {
        return from(this._supabase.auth.getSession()).pipe(
            map((response) => {
                if(response.error !== null) throw response.error;
                return response.data.session !== null;
            }) 
        )
    }
    getUser$(): Observable<User | null>{
       return from(this._supabase.auth.getSession()).pipe(
        map((response) => {
            if(null !== response.error) return null;
            return response.data.session!;
        }
       ),
       map((session) => {
        if(!session) return null;
        if (!session.user.email) {
            throw throwError(() => new Error("No email found"))
        }
        return {
            id: session.user.id,
            email: session.user.email
        }
       })
    )
    }
}