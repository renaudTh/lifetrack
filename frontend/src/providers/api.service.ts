import { inject, Injectable } from "@angular/core";
import { Client, Databases, Models } from "appwrite";
import { CLIENT_ID, DB_ID } from "./api.config";

@Injectable({providedIn: "root"})
export class ApiService {

    private readonly dbId: string = inject(DB_ID);
    private readonly clientId= inject(CLIENT_ID);
    private client:Client;
    private databases: Databases;
    constructor(){
        this.client = new Client();
        this.client.setProject(this.clientId);
        this.databases = new Databases(this.client);
    }
    public listDocuments(collectionId: string, queries?: string[]){
        return this.databases.listDocuments(this.dbId, collectionId, queries)
    }
    public createDocument(collectionId: string, id: string,  data: Omit<Models.Document, keyof Models.Document>, permissions?: string[]){
        return this.databases.createDocument(this.dbId, collectionId, id, data, permissions);
    }
    public getDocument(collectionId: string, id: string, queries?: string[]){
        return this.databases.getDocument(this.dbId, collectionId, id, queries)
    }
    public updateDocument(collectionId: string, id: string, data: Omit<Models.Document, keyof Models.Document>, permissions?: string[]){
        return this.databases.updateDocument(this.dbId, collectionId, id, data, permissions)
    }
    public deleteDocument(collectionId: string, id: string){
        return this.databases.deleteDocument(this.dbId, collectionId, id);
    }
}