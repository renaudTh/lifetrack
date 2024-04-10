import { Inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY, catchError, map, switchMap, withLatestFrom } from "rxjs";
import { DateService } from "../../../domain/date.service";
import { IRecordProvider, RECORD_PROVIDER } from "../../../domain/record.provider.interface";
import { RecordsActions } from "./record.actions";

@Injectable()
export class RecordsEffects {

    loadMonth$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RecordsActions.loadDisplayedDateRecords),
            switchMap(({ userId, date }) => this.recordProvider.getUserMonthHistory(userId, date)
                .pipe(
                    map(records => RecordsActions.loadingSuccess({ userMonth: records })),
                    catchError(() => EMPTY))
            )
        )
    );

    upsertRecord$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RecordsActions.upsertRecord),
            withLatestFrom(this.dateService.selectedDate$),
            switchMap(([{ userId, activity }, date]) => this.recordProvider.upsertRecord(userId, { activity, date }).pipe(
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
            switchMap(({ userId, record }) => this.recordProvider.downsertRecord(userId, record)
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
        @Inject(RECORD_PROVIDER) private recordProvider: IRecordProvider,
    ) { }
}