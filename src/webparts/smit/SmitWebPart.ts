import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SmitWebPartStrings';
import Smit from './components/Smit';
import { ISmitProps } from './components/ISmitProps';

import SharePointService from './services/SharePointService';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { Placeholder, IPlaceholderProps } from "@pnp/spfx-controls-react/lib/Placeholder";


export interface ISmitWebPartProps {
  listId:string;
  title:string;
}

export default class SmitWebPart extends BaseClientSideWebPart<ISmitWebPartProps> {
  /**
   * The serviece that does all the calls for SP
   */
  private _spService:SharePointService;

  public render(): void {

    if(this.properties.listId) {
      const element: React.ReactElement<ISmitProps> = React.createElement(
        Smit,
        {
          spService: this._spService,
          title: this.properties.title,
          displayMode: this.displayMode,
          updateProperty: (value: string) => {
            this.properties.title = value;
          }
        }
      );
  
      ReactDom.render(element, this.domElement);
    } else {
      const configElm: React.ReactElement<IPlaceholderProps> = React.createElement<IPlaceholderProps>(
        Placeholder ,
        {
          iconName: 'Edit',
          iconText: strings.ConfigureWP,
          description: strings.PleaseConfigure,
          buttonLabel: strings.ConfigureBtn,
          onConfigure: this.context.propertyPane.open
        }
      );  
      ReactDom.render(configElm, this.domElement);
    }
  }

  protected async onInit(): Promise<void> {  
    
    this._spService = new SharePointService(this.context, this.properties.listId);

    return super.onInit();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected async onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): Promise<void> {

    switch(propertyPath) {
      case 'listId':
        this._spService = new SharePointService(this.context, this.properties.listId);
        break;
    }

    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldListPicker('listId', {
                  label: strings.SelectList,
                  selectedList: this.properties.listId,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listId',
                  baseTemplate: 100,
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
