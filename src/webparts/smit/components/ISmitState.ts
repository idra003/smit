import { IDataItem } from '../models/IDataItem';

export interface ISmitState {
    data:IDataItem[];
    isLoading:boolean;
    item:IDataItem|null;
}