import { createReducer, on } from "@ngrx/store";
import { RecordState } from ".";
import { RecordsActions } from "./record.actions";

export const initialRecordsState: RecordState = {

}

export const recordsReducer = createReducer(
    initialRecordsState,
    on(RecordsActions.loadingSuccess, (_state, { userMonth }) => (
        userMonth.reduce((obj, item) => ({ ...obj, [item.id]: item }), {})
    )),
    on(RecordsActions.upsertSuccess, (state, { record }) => ({ ...state, [record.id]: record })),
    on(RecordsActions.downsertSuccess, (state, { record }) => {
        if (record.number === 0) {
            const {[record.id]: remove, ...newState } = state;
            return newState;
        }
        else {
            return { ...state, [record.id]: record }
        }
    }),
);