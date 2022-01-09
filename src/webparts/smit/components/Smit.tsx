import * as React from 'react';
import styles from './Smit.module.scss';
import { ISmitProps } from './ISmitProps';
import { ISmitState } from './ISmitState';

import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from 'office-ui-fabric-react/lib/DetailsList';
import * as strings from 'SmitWebPartStrings';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { 
  PrimaryButton, 
  IconButton 
} from 'office-ui-fabric-react';
import { IDataItem } from '../models/IDataItem';
import { DataPanel } from './DataPanel/DataPanel';
import { AppToastContainer } from './AppToastContainer/AppToastContainer';


/**
 * The columns of the files details list
 */
const COLUMNS:IColumn[] = [
  {
    key: 'name',
    name: strings.ColumnName,
    minWidth: 100,
    isResizable: true
  },
  {
    key: 'code',
    name: strings.ColumnCode,
    minWidth: 100,
    isResizable: true
  },
  {
    key: 'area',
    name: strings.ColumnArea,
    minWidth: 100,
    isResizable: true
  },
  {
    key: 'content',
    name: strings.ColumnContent,
    minWidth: 100,
    isResizable: true
  },
  {
    key: 'buttons',
    name: strings.ColumnButtons,
    minWidth: 100,
    isResizable: true
  }
];

export default class Smit extends React.Component<ISmitProps, ISmitState> {

  constructor(props:ISmitProps) {
    super(props);

    this.state = {
      data: [],
      isLoading: true,
      item: null
    };
  }

  public componentDidMount() {
    this._getData();
  }

  public componentDidUpdate(prevProps:ISmitProps) { 
    if(prevProps.spService !== this.props.spService) {
      this._getData();
    }
  }

  private _getData = () => {
    this.setState({
      isLoading: true
    });

    this.props.spService.getData().then(data => {
      this.setState({
        data,
        isLoading: false
      });
    });
  }

  /**
   * Renders out the Detalis list cell
   * @param item The data item of the details list
   * @param index The columns index of the column
   * @param column The column of the cell that needs to be rendered
   */
  private _renderItemColumn = (item?:IDataItem, index?: number, column?: IColumn):React.ReactNode => {
    let ret:React.ReactNode = null;

    switch(column.key) {
      default:
        ret = item[column.key];
        break;
      case 'buttons':
        ret = (
          <IconButton 
            iconProps={{iconName: 'Edit'}}
            onClick={() => this.setState({ item }) }
          />
        );
        break;
    }

    return ret;
  }

  private _handlePanelDismiss = () => {
    this.setState({
      item: null
    });
  }

  private _handleSave = (item:IDataItem) => {
    const data = [...this.state.data];
    const index = (data as any).findIndex(i => i.id == item.id);

    if(index < 0) {
      data.push(item);
    } else {
      data[index] = item;
    }

    this.setState({
      data,
      item: null
    });
  }

  private _handleAddNewClick = () => {
    const item:IDataItem = {
      id: 0,
      name: '',
      code: '',
      area: '',
      content: ''
    };

    this.setState({
      item: item
    });
  }

  public render(): React.ReactElement<ISmitProps> {
    return (
      <div>
        <WebPartTitle 
          displayMode={this.props.displayMode}
          title={this.props.title}
          updateProperty={this.props.updateProperty} 
        />
        {
          this.state.isLoading ? (
            <Spinner size={SpinnerSize.large} />
          ) : (
            <>
              <DetailsList
                items={this.state.data}
                compact={false}
                columns={COLUMNS}
                selectionMode={SelectionMode.none}
                layoutMode={DetailsListLayoutMode.justified}
                isHeaderVisible={true}
                ariaLabelForSelectionColumn="Toggle selection"
                ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                checkButtonAriaLabel="select row"
                onRenderItemColumn={this._renderItemColumn}
              />
              <div className={styles.buttons}>
                <PrimaryButton 
                  text={strings.AddBtn}  
                  onClick={this._handleAddNewClick}
                />
              </div>
            </>
          )
        }
        <DataPanel 
          item={this.state.item}
          spService={this.props.spService}
          onDismiss={this._handlePanelDismiss}
          onSave={this._handleSave}
        />
        <AppToastContainer />
      </div>
    );
  }
}
