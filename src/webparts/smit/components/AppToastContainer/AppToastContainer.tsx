import * as React from 'react';
import styles from './AppToastContainer.module.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * The container that holds the toastyfi container
 * Needed to apply custom CSS to the toasty container
 */
export function AppToastContainer(props:React.PropsWithChildren<{}>) {
    return (
        <div className={styles.toastyContainer}>
            <ToastContainer autoClose={15000} />
        </div>
    );
}