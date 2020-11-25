import React, { Component } from 'react';
import { manageStore } from 'src';
import { LogItem } from 'src/components/logItem';
import { MessageFilter } from 'src/components/messageFilter';
import { MessageItem } from 'src/components/messageItem';
import { MessageFilterType, MessageStore, MessageTable } from 'src/store/messageStore';
import { ZainLogTable } from 'src/store/zainLogStore';
import sleep from 'src/utils/sleep';
import './message.less';

interface MessageProps {
    children?: React.ReactNode;
}

interface MessageState {
    messageDatas: MessageTable[];
    logDatas: ZainLogTable[];
}

/**
 * 留言板组件
 */
export class Message extends Component<MessageProps, MessageState> {
    constructor(props: MessageProps) {
        super(props);
        this.state = {
            messageDatas: [],
            logDatas: []
        }
        this.messageStore = manageStore.messageStore;
        this.handleClearMessage = this.handleClearMessage.bind(this);
        this.handleCleaLog = this.handleCleaLog.bind(this);
        this.handleAddMessage = this.handleAddMessage.bind(this);
        this.handleFilterReset = this.handleFilterReset.bind(this);
    }

    /** 留言板 store */
    messageStore: MessageStore;

    componentDidMount(): void {
        this.initMessageDatas();
        this.initLogDatas();
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
     * 初始化获取日志信息
     */
    initLogDatas(): void {
        this.messageStore.zainDB.zainLogStore.zainDB.onDatabaseOpenSuccess((event: Event) => {
            this.refreshLogDatas();
        });
    }

    /**
     * 刷新所有留言数据
     */
    refreshMessageDatas(): void {
        this.messageStore.getMessageDatas((datas: MessageTable[]) => {
            this.setState({ messageDatas: datas });
        });
        sleep(500).then(() => {
            this.refreshLogDatas();
        });
    }

    /**
     * 刷新所有日志信息
     */
    refreshLogDatas(): void {
        this.messageStore.zainDB.zainLogStore.getZainLogDatas((datas: ZainLogTable[]) => {
            this.setState({ logDatas: datas });
            // 滚动条滚动到最底部
            const element = document.getElementById('zain-log-content-id');
            element.scrollTop = element.scrollHeight;
        });
    }

    /**
     * 触发留言清空事件
     */
    handleClearMessage(): void {
        this.messageStore.clearMessage((event: Event) => {
            this.refreshMessageDatas();
        });
    }

    /**
     * 触发日志清空事件
     */
    handleCleaLog(): void {
        this.messageStore.zainDB.zainLogStore.clearZainLog((event: Event) => {
            this.refreshLogDatas();
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
     * 触发删除指定日志事件
     * @param id 每条日志对应的 id
     */
    handleDeleteLog(id: number): void {
        this.messageStore.zainDB.zainLogStore.deleteZainLog(id, (event: Event) => {
            this.refreshLogDatas();
        });
    }

    /**
     * 触发指定留言数据修改功能
     * @param newMessage 当前编辑完成的留言数据
     */
    handleEditMessageConfirm(newMessage: MessageTable): void {
        this.messageStore.updateMessage(newMessage, (event: Event) => {
            this.refreshMessageDatas();
        });
    }

    /**
     * 触发筛选重置操作
     */
    handleFilterReset(): void {
        this.refreshMessageDatas();
    }

    /**
     * 触发筛选操作
     * @param messageFilter 筛选参数
     */
    handleFilterConfirm(messageFilter: MessageFilterType): void {
        this.messageStore.searchMessageDatas(messageFilter, (datas: MessageTable[]) => {
            this.setState({ messageDatas: datas });
            sleep(500).then(() => {
                this.refreshLogDatas();
            });
        });
    }
    
    render(): JSX.Element {
        return (
            <div className="zain-indexed-db">
                <div className="zain-message">
                    <div className="zain-message-head">
                        <div className="zain-message-title">【志银留言板】</div>
                        <div
                            className="zain-message-clear"
                            onClick={this.handleClearMessage}
                        >清空留言</div>
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
                            <span className="message-item-operation">操作</span>
                        </div>
                        <MessageFilter
                            className="message-content-filter"
                            onReset={this.handleFilterReset}
                            onFilterConfirm={(messageFilter: MessageFilterType) => { this.handleFilterConfirm(messageFilter) }}
                        />
                    </div>
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
                <div className="zain-log">
                    <div className="zain-log-head">
                        <div className="zain-log-title">【志银日志】</div>
                        <div
                            className="zain-log-clear"
                            onClick={this.handleCleaLog}
                        >清空日志</div>
                        <div className="log-content-title">
                            <span className="log-item-id">id</span>
                            <span className="log-item-from">日志来源</span>
                            <span className="log-item-level">日志等级</span>
                            <span className="log-item-msg">日志信息</span>
                            <span className="log-item-version">日志版本</span>
                            <span className="log-item-time">日志时间</span>
                            <span className="log-item-operation">操作</span>
                        </div>
                    </div>
                    <div id="zain-log-content-id" className="zain-log-content">
                        {/* 日志项使用每条留言项组件 */}
                        {
                            this.state.logDatas &&
                            this.state.logDatas.map((value: ZainLogTable, index: number, array: ZainLogTable[]) => {
                                return (
                                    <LogItem
                                        key={index}
                                        log={value}
                                        onClickDelete={(id: number) => { this.handleDeleteLog(id); }}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}
