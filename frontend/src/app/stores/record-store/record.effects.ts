import { Inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY, catchError, map, switchMap, withLatestFrom, zip } from "rxjs";
import { DateService } from "../../../domain/date.service";
import { IRecordProvider, RECORD_PROVIDER } from "../../../domain/record.provider.interface";
import { RecordsActions } from "./record.actions";
import { UserProviderService } from "../../../providers/user.provider.service";

@Injectable()
export class RecordsEffects {

    loadMonth$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RecordsActions.loadDisplayedDateRecords),
            withLatestFrom(this.userService.getUser$()),
            switchMap(([{date }, user]) => this.recordProvider.getUserMonthHistory(user!.id, date)
                .pipe(
                    map(records => RecordsActions.loadingSuccess({ userMonth: records })),
                    catchError(() => EMPTY))
            )
        )
    );

    upsertRecord$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RecordsActions.upsertRecord),
            withLatestFrom(this.dateService.selectedDate$, this.userService.getUser$()),
            switchMap(([{activity }, date, user]) => this.recordProvider.upsertRecord(user!.id ,date, activity).pipe(
                map((record) => RecordsActions.upsertSuccess({ record })),
                catchError((error: any) => {
                    console.error(error)
                    return EMPTY;
                })
            )
        ))
    )

    downsertRecord$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RecordsActions.downsertRecord),
            withLatestFrom(this.userService.getUser$()),
            switchMap(([{record }, user]) => this.recordProvider.downsertRecord(user!.id, record)
                .pipe(
                    map(record => RecordsActions.downsertSuccess({ record })),
                    catchError(() => EMPTY)
                )
            )
        )
    )

    constructor(
        private actions$: Actions,
        private dateService: DateService,
        private userService: UserProviderService,
        @Inject(RECORD_PROVIDER) private recordProvider: IRecordProvider,
    ) { }
}