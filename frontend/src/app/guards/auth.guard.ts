import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { map, Observable } from "rxjs";
import { UserService } from "../../domain/user.service";

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {

    const userService = inject(UserService);
    const router = inject(Router);
    return userService.user$.pipe(
        map((maybeUser) => {
            if(maybeUser === null){
                router.navigate(["login"]);
                return false;
            }
            return true;
        })
    )
}

export const LoginGuard = () => {
    const userService = inject(UserService);
    const router = inject(Router);
    return userService.user$.pipe(
        map((maybeUser) => {
            if(maybeUser === null){
                return true;
            }
            router.navigate([""]);
            return false;
        })
    )

}