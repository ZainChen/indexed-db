import React, { Component } from 'react';
import { ZainLogTable } from 'src/store/zainLogStore';
import './logItem.less';

interface LogItemProps {
    children?: React.ReactNode;
    /** 当前留言数据 */
    log: ZainLogTable;
    /** 监听删除指定留言 */
    onClickDelete: (id: number) => void;
}

interface LogItemState {
}

/**
 * 留言板每条留言项组件
 */
export class LogItem extends Component<LogItemProps, LogItemState> {
    constructor(props: LogItemProps) {
        super(props);
        this.handleDeleteLog = this.handleDeleteLog.bind(this);
    }

    /**
     * 触发删除指定日志事件
     */
    handleDeleteLog(): void {
        if (this.props.onClickDelete) {
            this.props.onClickDelete(this.props.log.id);
        }
    }

    render(): JSX.Element {
        return (
            <div className="zain-log-item">
                <span className="log-item-id">{this.props.log.id}</span>
                <span className="log-item-from" title={this.props.log.from}>{this.props.log.from}</span>
                <span className="log-item-level">{this.props.log.level}</span>
                <span className="log-item-msg" title={this.props.log.msg}>{this.props.log.msg}</span>
                <span className="log-item-version">{this.props.log.version}</span>
                <span className="log-item-time">{this.props.log.time}</span>
                <span className="log-item-delete" onClick={this.handleDeleteLog}>删除</span>
            </div>
        );
    }
}
