import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { API_URL } from "../environments/environment.interface";

export const apiInterceptorFn: HttpInterceptorFn =
    (req: HttpRequest<unknown>, next:
        HttpHandlerFn) => {

        const apiUrl = inject(API_URL)

        if (!req.url.startsWith('api://')) return next(req);

        const resolvedUrl = req.url.replace(/^api:\/\//, apiUrl + '/');
        let resolvedReq = req.clone({
            url: resolvedUrl,
        });
        return next(resolvedReq);

    };

