import React, { Component } from 'react';
import { Message } from 'src/components/message';
import './root.less';

export class Root extends Component {
    render(): JSX.Element {
        return (
            <div className="zain-root">
                <Message />
            </div>
        );
    }
}
