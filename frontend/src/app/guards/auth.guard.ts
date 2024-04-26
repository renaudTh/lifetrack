import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { UserProviderService } from "../../providers/user.provider.service";

export const authGuard: CanActivateFn =  (route, state) => {
    const userService = inject(UserProviderService)

    return userService.authenticated$();
  };