import React, { Component, Fragment } from 'react';
import { MessageTable } from 'src/store/messageStore';
import './messageItem.less';

interface MessageItemProps {
    children?: React.ReactNode;
    /** 当前留言数据 */
    message: MessageTable;
    /** 监听删除指定留言 */
    onClickDelete: (id: number) => void;
    /** 监听编辑指定留言确认完成 */
    onEditConfirm: (newMessage: MessageTable) => void;
}

interface MessageItemState {
    /** 当前留言是否正在编辑 */
    editing: boolean;
    /** 正在编辑的用户名 */
    name: string;
    /** 正在编辑的邮箱 */
    mail: string;
    /** 正在编辑的内容 */
    content: string;
}

/**
 * 留言板每条留言项组件
 */
export class MessageItem extends Component<MessageItemProps, MessageItemState> {
    constructor(props: MessageItemProps) {
        super(props);
        this.state ={
            editing: false,
            name: this.props.message.name,
            mail: this.props.message.mail,
            content: this.props.message.content
        }
        this.handleDeleteMessage = this.handleDeleteMessage.bind(this);
        this.handleEditMessageStart = this.handleEditMessageStart.bind(this);
        this.handleEditMessageConfirm = this.handleEditMessageConfirm.bind(this);
    }

    /**
     * 触发删除留言事件
     */
    handleDeleteMessage(): void {
        if (this.props.onClickDelete) {
            this.props.onClickDelete(this.props.message.id);
        }
    }

    /**
     * 触发开始编辑留言
     */
    handleEditMessageStart(): void {
        this.setState({ editing: true });
    }

    /**
     * 触发编辑留言确认完成事件
     */
    handleEditMessageConfirm(): void {
        this.setState({ editing: false });
        if (this.props.onEditConfirm) {
            const newMessage: MessageTable ={
                id: this.props.message.id,
                name: this.state.name,
                mail: this.state.mail,
                content: this.state.content,
                time: new Date().toLocaleString(),
            }
            this.props.onEditConfirm(newMessage);
        }
    }

    /**
     * 监听姓名编辑
     * @param event 
     */
    onChangeNameEdit(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ name: event.target.value });
    }

    /**
     * 监听邮件编辑
     * @param event 
     */
    onChangeMailEdit(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ mail: event.target.value });
    }

    /**
     * 监听留言内容编辑
     * @param event 
     */
    onChangeContentEdit(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ content: event.target.value });
    }
    
    render(): JSX.Element {
        return (
            <div className="zain-message-item">
                <span className="message-item-id">{this.props.message.id}</span>
                {
                    this.state.editing ?
                    <span className="item-name-edit">
                        <input
                            className="name-edit-input"
                            type="text"
                            name="name"
                            value={this.state.name}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.onChangeNameEdit(event) }}
                        />
                    </span> :
                    <span className="message-item-name" title={this.props.message.name}>{this.props.message.name}</span>
                }
                {
                    this.state.editing ?
                    <span className="item-mail-edit">
                        <input
                            className="mail-edit-input"
                            type="text"
                            name="mail"
                            value={this.state.mail}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.onChangeMailEdit(event) }}
                        />
                    </span>:
                    <span className="message-item-mail">{this.props.message.mail}</span>
                }
                {
                    this.state.editing ?
                    <span className="item-content-edit">
                        <input
                            className="content-edit-input"
                            type="text"
                            name="content"
                            value={this.state.content}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.onChangeContentEdit(event) }}
                        />
                    </span> :
                    <span className="message-item-content" title={this.props.message.content}>{this.props.message.content}</span>
                }
                <span className="message-item-time">{this.props.message.time}</span>
                {
                    this.state.editing ?
                    <span
                        className="message-item-complete"
                        onClick={this.handleEditMessageConfirm}
                    >完成</span> :
                    <Fragment>
                        <span
                            className="message-item-editor"
                            onClick={this.handleEditMessageStart}
                        >编辑</span>
                        <span
                            className="message-item-delete"
                            onClick={this.handleDeleteMessage}
                        >删除</span>
                    </Fragment>
                }
            </div>
        );
    }
}
