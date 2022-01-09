import SharePointService from "../services/SharePointService"; 
import { DisplayMode } from '@microsoft/sp-core-library';

export interface ISmitProps {
  spService:SharePointService;
  title: string;
  displayMode: DisplayMode;
  updateProperty: (value: string) => void;
}
