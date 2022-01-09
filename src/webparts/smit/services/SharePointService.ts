import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { IDataItem } from '../models/IDataItem';
import { toast } from 'react-toastify';

/**
 * The class that does all the calls to the SharePoint API
 */
 export default class SharePointService {
    /**
     * The list ID of the list that holds the data
     */
    private _listId:string;
    
    /**
     * The constructor of the service
     * @param context The context of the WP
     * @param listId The list ID that holds all the dat
     */
    public constructor(context: WebPartContext, listId:string) {

        this._listId = listId;

        sp.setup({
            spfxContext: context
        });
    }

    public async getData():Promise<IDataItem[]> {
        try {
            const items:any[] = await sp.web.lists.getById(this._listId).items.getAll();
            return items.map(item => {
                const data:IDataItem = {
                    name: item.Title,
                    code: item.smitCode,
                    area: item.smitArea,
                    content: item.smitContent,
                    id: item.Id
                };
                return data;
            });
        } catch(e) {
            console.error('SMIT', e);
            toast.error('Could not retrive the data');
            return [];
        }
    }

    public async saveData(data:IDataItem):Promise<number> {
        const updateItem:any = {
            Title: data.name,
            smitCode: data.code,
            smitArea: data.area,
            smitContent: data.content
        };

        let ret:number = data.id;

        try {
            if(data.id) {
                await sp.web.lists.getById(this._listId).items.getById(data.id).update(updateItem);
            } else {
                const addResult = await sp.web.lists.getById(this._listId).items.add(updateItem);
                ret = addResult.data.Id;
            }
        } catch(e) {
            console.error('SMIT', e);
            toast.error('Could not save the item');
            return null;
        }
        
        return ret;
    }
}