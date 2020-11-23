import React from 'react';
import { render } from "react-dom";
import { Root } from 'src/components/root';
import { ManageStore } from 'src/store';

export const manageStore = new ManageStore();

render(
    <Root />,
    document.getElementById('root')
);
