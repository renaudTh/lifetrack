import { InjectionToken } from "@angular/core";
import { Client } from "appwrite";


export const CLIENT = new InjectionToken<Client>("CLIENT");
export const DB_ID = new InjectionToken<string>("DB_ID");
