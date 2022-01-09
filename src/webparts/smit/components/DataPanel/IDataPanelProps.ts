import { IDataItem } from '../../models/IDataItem';
import SharePointService from '../../services/SharePointService';

export interface IDataPanelProps {
    item:IDataItem|null;
    onDismiss:() => void;
    onSave:(item:IDataItem) => void;
    spService:SharePointService;
}