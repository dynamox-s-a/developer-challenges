"use client";

import {ReactNode} from 'react';
import {Provider} from 'react-redux';
import {store} from '@/src/store/store';

const RootLayout = ({children}: { children: ReactNode }) => (
    <Provider store={store}>
        <html lang="en">
        <body>{children}</body>
        </html>
    </Provider>
);

export default RootLayout;
