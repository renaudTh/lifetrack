import { Activity } from "../../../domain/activity";


export interface ActivitiesState {
    [id: string]: Activity;
}

