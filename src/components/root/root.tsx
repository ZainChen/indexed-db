import React, { Component } from 'react';
import { Message } from 'src/components/message';

export class Root extends Component {
    render(): JSX.Element {
        return (
            <div>
                <Message />
            </div>
        );
    }
}
