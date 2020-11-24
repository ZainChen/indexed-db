import React, { Component } from 'react';
import { manageStore } from 'src';
import { MessageItem } from 'src/components/messageItem';
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

    /**
     * 触发删除指定留言事件
     * @param id 每条留言对应的 id
     */
    handleDeleteMessage(id: number): void {
        this.messageStore.deleteMessage(id, (event: Event) => {
            this.refreshMessageDatas();
        });
    }

    /**
     * 触发指定留言数据修改功能
     * @param newMessage 当前编辑完成的留言数据
     */
    handleEditMessageConfirm(newMessage: MessageTable): void {
        this.messageStore.updateMessage(newMessage, (event: Event) => {
            this.refreshMessageDatas();
            console.log('zain>>>>>edit, newMessage', newMessage);
        });
    }
    
    render(): JSX.Element {
        return (
            <div className="zain-message">
                <div className="zain-message-head">
                    <div className="zain-message-title">【志银留言板】</div>
                    {/* <div className="zain-message-search">搜索留言</div> */}
                    <div
                        className="zain-message-add"
                        onClick={this.handleAddMessage}
                    >添加留言</div>
                    <div className="message-content-title">
                        <span className="message-item-id">id</span>
                        <span className="message-item-name">姓名</span>
                        <span className="message-item-mail">邮箱</span>
                        <span className="message-item-content">留言内容</span>
                        <span className="message-item-time">留言时间</span>
                        <span className="message-item-modify">修改</span>
                    </div>
                </div>
                <div className="zain-message-fill">fill</div>
                <div className="zain-message-content">
                    {
                        this.state.messageDatas &&
                        this.state.messageDatas.map((value: MessageTable, index: number, array: MessageTable[]) => {
                            return (
                                <MessageItem
                                    key={index}
                                    message={value}
                                    onClickDelete={(id: number) => { this.handleDeleteMessage(id) }}
                                    onEditConfirm={(newMessage: MessageTable) => { this.handleEditMessageConfirm(newMessage) }}
                                />
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}
