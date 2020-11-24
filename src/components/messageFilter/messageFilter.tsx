import React, { Component, Fragment } from 'react';
import { MessageTable } from 'src/store/messageStore';
import './messageFilter.less';

interface MessageFilterProps {
    children?: React.ReactNode;
    className?: string;
    /** 监听单击重置按钮 */
    onReset: () => void;
    /** 监听确定筛选按钮 */
    onFilterConfirm: (messageFilter: MessageTable) => void;
}

interface MessageFilterState {
    /** 正在编辑的每条留言对应的 id */
    id: number;
    /** 正在编辑的用户名 */
    name: string;
    /** 正在编辑的邮箱 */
    mail: string;
    /** 正在编辑的内容 */
    content: string;
    /** 留言时间 */
    time: string;
}

/**
 * 留言板筛选组件
 */
export class MessageFilter extends Component<MessageFilterProps, MessageFilterState> {
    constructor(props: MessageFilterProps) {
        super(props);
        this.state = {
            id: null,
            name: '',
            mail: '',
            content: '',
            time: ''
        }
        this.handleReset = this.handleReset.bind(this);
        this.handleFilterConfirm = this.handleFilterConfirm.bind(this);
    }

    onChangeIdEdit(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ id: parseInt(event.target.value) });
    }

    onChangeNameEdit(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ name: event.target.value });
    }

    onChangeMailEdit(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ mail: event.target.value });
    }

    onChangeContentEdit(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ content: event.target.value });
    }

    onChangeTimeEdit(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ time: event.target.value });
    }

    handleReset(): void {
        this.setState({
            id: null,
            name: '',
            mail: '',
            content: '',
            time: ''
        });
        if (this.props.onReset) {
            this.props.onReset();
        }
    }

    handleFilterConfirm(): void {
        const messageFilter: MessageTable = {
            id: this.state.id,
            name: this.state.name,
            mail: this.state.mail,
            content: this.state.content,
            time: this.state.time
        }
        if (this.props.onFilterConfirm) {
            this.props.onFilterConfirm(messageFilter);
        }
    }

    render(): JSX.Element {
        return (
            <div className={`zain-message-filter${this.props.className ? ' '+this.props.className : ''}`}>
                <span className="message-filter-id">
                    <input
                        className="id-edit-input"
                        type="text"
                        name="id"
                        value={this.state.id ? this.state.id.toString() : ''}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.onChangeIdEdit(event) }}
                    />
                </span>
                <span className="message-filter-name">
                    <input
                        className="name-edit-input"
                        type="text"
                        name="name"
                        value={this.state.name}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.onChangeNameEdit(event) }}
                    />
                </span>
                <span className="message-filter-mail">
                    <input
                        className="mail-edit-input"
                        type="text"
                        name="mail"
                        value={this.state.mail}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.onChangeMailEdit(event) }}
                    />
                </span>
                <span className="message-filter-content">
                    <input
                        className="content-edit-input"
                        type="text"
                        name="content"
                        value={this.state.content}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.onChangeContentEdit(event) }}
                    />
                </span>
                <span className="message-filter-time">
                    <input
                        className="time-edit-input"
                        type="text"
                        name="time"
                        value={this.state.time}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.onChangeTimeEdit(event) }}
                    />
                </span>
                <span
                    className="message-filter-start"
                    onClick={this.handleFilterConfirm}
                >筛选</span>
                <span
                    className="message-filter-reset"
                    onClick={this.handleReset}
                >重置</span>
            </div>
        );
    }
}
