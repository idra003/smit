import * as React from 'react';
import styles from './DataPanel.module.scss';
import { IDataPanelProps } from './IDataPanelProps';

import { Panel } from 'office-ui-fabric-react/lib/Panel';
import * as _ from '@microsoft/sp-lodash-subset';
import { IDataItem } from '../../models/IDataItem';
import * as strings from 'SmitWebPartStrings';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

export function DataPanel(props:React.PropsWithChildren<IDataPanelProps>) {
    const [_isOpen, _setIsOpen] = React.useState(false);
    const [_item, _setItem] = React.useState<IDataItem|null>(null);
    const [_header, _setHeader] = React.useState('');
    const [_isSaving, _setIsSaving] = React.useState(false);
    
    React.useEffect(() => {
        if(props.item) {
            _setIsOpen(true);
            _setItem(_.cloneDeep(props.item));
            _setHeader(props.item.id ? strings.ChangePanelHeader : strings.NewPanelHeader);
        } else {
            _setIsOpen(false);
        }
    }, [props.item]);

    if(!_item) {
        return null;
    }

    const _handleSaveClick = () => {
        props.spService.saveData(_item).then((id) => {
            if(id !== null) {
                const item = _.cloneDeep(_item);
                item.id = id;
                props.onSave(item);
            }
        });
    };

    return (
        <Panel
            headerText={_header}
            isOpen={_isOpen}
            onDismiss={props.onDismiss}
            // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
            closeButtonAriaLabel="Close"
        >
            <TextField 
                label={strings.ColumnName}
                value={_item.name}
                onChange={(e, str) => {
                    const item = _.cloneDeep(_item);
                    item.name = str;
                    _setItem(item);
                }}
            />
            <TextField 
                label={strings.ColumnCode}
                value={_item.code}
                onChange={(e, str) => {
                    const item = _.cloneDeep(_item);
                    item.code = str;
                    _setItem(item);
                }}
            />
            <TextField 
                label={strings.ColumnArea}
                value={_item.area}
                onChange={(e, str) => {
                    const item = _.cloneDeep(_item);
                    item.area = str;
                    _setItem(item);
                }}
            />
            <TextField 
                label={strings.ColumnContent}
                value={_item.content}
                multiline
                rows={3}
                onChange={(e, str) => {
                    const item = _.cloneDeep(_item);
                    item.content = str;
                    _setItem(item);
                }}
            />
            <div className={styles.buttons}>
                {
                    _isSaving &&
                    <Spinner 
                        size={SpinnerSize.medium} 
                        className={styles.loader}
                    />
                }
                <PrimaryButton 
                    text={strings.SaveBtn}
                    onClick={_handleSaveClick}
                    disabled={_isSaving}
                />
                <DefaultButton 
                    text={strings.CancelBtn}
                    onClick={props.onDismiss}
                    disabled={_isSaving}
                />
            </div>
        </Panel>
    );
}