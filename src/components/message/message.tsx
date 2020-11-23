import React, { Component } from 'react';
import { manageStore } from 'src';
import { MessageStore, MessageTable } from 'src/store/messageStore';
import './message.less';

interface MessageProps {
    children?: React.ReactNode;
}

interface MessageState {
    messageDatas: MessageTable[];
}

/**
 * 留言板组件
 */
export class Message extends Component<MessageProps, MessageState> {
    constructor(props: MessageProps) {
        super(props);
        this.state = {
            messageDatas: []
        }
        this.messageStore = manageStore.messageStore;
        this.handleAddMessage = this.handleAddMessage.bind(this);
    }

    /** 留言板 store */
    messageStore: MessageStore;

    componentDidMount(): void {
        this.initMessageDatas();
    }

    /**
     * 初始化获取留言数据
     */
    initMessageDatas(): void {
        this.messageStore.zainDB.onDatabaseOpenSuccess((event: Event) => {
            this.refreshMessageDatas();
        });
    }

    /**
     * 刷新所有留言数据
     */
    refreshMessageDatas(): void {
        this.messageStore.onGetMessageDatas((datas: MessageTable[]) => {
            this.setState({ messageDatas: datas });
            console.log("所有数据查询完成: ", datas);
        });
    }

    /**
     * 触发添加留言事件
     */
    handleAddMessage(): void {
        this.messageStore.addMessage((event: Event) => {
            this.refreshMessageDatas();
        });
    }
    
    render(): JSX.Element {
        return (
            <div className="zain-message">
                <div className="zain-message-head">
                    <div className="zain-message-title">【志银留言板】</div>
                    <div className="zain-message-search">搜索留言</div>
                    <div
                        className="zain-message-add"
                        onClick={this.handleAddMessage}
                    >添加留言</div>
                </div>
                <div className="zain-message-content">
                    {
                        this.state.messageDatas &&
                        this.state.messageDatas.map((value: MessageTable, index: number, array: MessageTable[]) => {
                            return (
                                <div className="zain-message-item" key={index}>
                                    <span className="message-item-id">{value.id}</span>
                                    <span className="message-item-name">{value.name}</span>
                                    <span className="message-item-mail">{value.mail}</span>
                                    <span className="message-item-content">{value.content}</span>
                                    <span className="message-item-time">{value.time}</span>
                                    <span className="message-item-delete">删除</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}
