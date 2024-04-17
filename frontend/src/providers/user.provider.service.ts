import { Inject, Injectable } from "@angular/core";
import { AuthTokenResponsePassword, SupabaseClient, UserResponse, createClient } from "@supabase/supabase-js";
import { EMPTY, Observable, catchError, from, map, of, throwError } from "rxjs";
import { User } from "../domain/user";


@Injectable({ providedIn: 'root' })
export class UserProvider {


    constructor(@Inject("SUPABASE_CLIENT") private _supabase: SupabaseClient) { }


    login(email: string, password: string): Observable<User> {
        return from(this._supabase.auth.signInWithPassword({
            email,
            password
        })).pipe(
            map((response) => {
                if (response.error !== null|| response.data === null) {
                    throw new Error(response.error?.message);
                }
                return response.data.user;
            }),
            map((user) => {
                if (!user.email) {
                    throw throwError(() => new Error("No email found"))
                }
                return {
                    email: user.email,
                    id: user.id
                }
            })
        )
    }

    async getUser(){
        from(this._supabase.auth.getUser()).pipe(
            map((response: UserResponse) => {
                if(response.error !== null || response.data === null){
                    throw new Error("User not found");
                }
                return response.data
            })
        );
        
    }
}