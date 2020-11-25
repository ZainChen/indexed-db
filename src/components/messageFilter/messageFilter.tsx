import React, { Component } from 'react';
import { RangeTypeEnum } from 'src/database/zainDB';
import { IdFilterType, MessageFilterType } from 'src/store/messageStore';
import './messageFilter.less';

interface MessageFilterProps {
    children?: React.ReactNode;
    className?: string;
    /** 监听单击重置按钮 */
    onReset: () => void;
    /** 监听确定筛选按钮 */
    onFilterConfirm: (messageFilter: MessageFilterType) => void;
}

interface MessageFilterState {
    /** 标记是否显示 id 条件筛选框 */
    showIdFilter: boolean;
    /** id 筛选状态 */
    idFilter: IdFilterType;
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
            showIdFilter: false,
            idFilter: new IdFilterType(),
            name: '',
            mail: '',
            content: '',
            time: ''
        }
        this.handleReset = this.handleReset.bind(this);
        this.handleFilterConfirm = this.handleFilterConfirm.bind(this);
    }

    /**
     * 监听姓名筛选项编辑
     * @param event 
     */
    onChangeNameEdit(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ name: event.target.value });
    }

    /**
     * 监听邮件筛选项编辑
     * @param event 
     */
    onChangeMailEdit(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ mail: event.target.value });
    }

    /**
     * 监听内容筛选项编辑
     * @param event 
     */
    onChangeContentEdit(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ content: event.target.value });
    }

    /**
     * 监听时间筛选项编辑
     * @param event 
     */
    onChangeTimeEdit(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ time: event.target.value });
    }

    /**
     * 触发所有筛选参数重置
     */
    handleReset(): void {
        this.setState({
            showIdFilter: false,
            idFilter: new IdFilterType(),
            name: '',
            mail: '',
            content: '',
            time: ''
        });
        if (this.props.onReset) {
            this.props.onReset();
        }
    }

    /**
     * 触发筛选确认提交功能
     */
    handleFilterConfirm(): void {
        const messageFilter: MessageFilterType = {
            idFilter: this.state.idFilter,
            name: this.state.name,
            mail: this.state.mail,
            content: this.state.content,
            time: this.state.time
        }
        if (this.props.onFilterConfirm) {
            this.props.onFilterConfirm(messageFilter);
        }
    }

    /**
     * id 内容显示筛选框，获取焦点触发
     * @param event 
     */
    onIdEditInputFocus(event: React.FocusEvent<HTMLInputElement>): void {
        this.setState({ showIdFilter: true });
    }

    /**
     * 取消 id 筛选设置
     */
    handleIdQueryCancel(): void {
        this.setState({
            showIdFilter: false,
            idFilter: new IdFilterType()
        });
    }

    /**
     * 确认 id 筛选设置
     */
    handleIdQueryConfirm(): void {
        this.setState({ showIdFilter: false });
    }

    /**
     * 选中固定 id 单选框
     * @param event 
     */
    handleIdOnlyRadio(event: React.ChangeEvent<HTMLInputElement>): void {
        let newIdFilter = new IdFilterType();
        newIdFilter.rangeType = RangeTypeEnum.ONLY;
        this.setState({ idFilter: newIdFilter });
    }

    /**
     * 固定 id 输入
     * @param event 
     */
    handleIdOnlyInput(event: React.ChangeEvent<HTMLInputElement>): void {
        let newIdFilter = this.state.idFilter;
        newIdFilter.id = parseInt(event.target.value);
        newIdFilter.idFilterExpression = event.target.value;
        this.setState({ idFilter: newIdFilter });
    }

    /**
     * 选中左闭或开间（大于或大于等于 id 范围）单选框
     * @param open true|false(不包含|包含)，理解为集合的左开或闭区间
     */
    handleIdLowerBound(open: boolean): void {
        let newIdFilter = new IdFilterType();
        newIdFilter.rangeType = RangeTypeEnum.LOWERBOUND;
        newIdFilter.lowerIdOpen = open;
        this.setState({ idFilter: newIdFilter });
    }

    /**
     * 选中左开闭间（大于等于 id 范围）输入
     * @param event 用来说去输入框的值
     * @param open true|false(不包含|包含)，理解为集合的左开或闭区间
     */
    handleIdLowerBoundInput(event: React.ChangeEvent<HTMLInputElement>): void {
        let newIdFilter = this.state.idFilter;
        newIdFilter.lowerId = parseInt(event.target.value);
        newIdFilter.idFilterExpression = `${this.state.idFilter.lowerIdOpen ? '(' : '['}` + event.target.value + `, ${this.state.idFilter.upperId ? this.state.idFilter.upperId : '~'}${this.state.idFilter.upperIdOpen ? ')' : ']'}`;
        this.setState({ idFilter: newIdFilter });
    }

    /**
     * 选中右闭或开间（大于或大于等于 id 范围）单选框
     * @param open true|false(不包含|包含)，理解为集合的右开或闭区间
     */
    handleIdUpperBound(open: boolean): void {
        let newIdFilter = new IdFilterType();
        newIdFilter.rangeType = RangeTypeEnum.UPPERBOUND;
        newIdFilter.upperIdOpen = open;
        this.setState({ idFilter: newIdFilter });
    }

    /**
     * 选中右开闭间（大于等于 id 范围）输入
     * @param event 用来说去输入框的值
     * @param open true|false(不包含|包含)，理解为集合的右开或闭区间
     */
    handleIdUpperBoundInput(event: React.ChangeEvent<HTMLInputElement>): void {
        let newIdFilter = this.state.idFilter;
        newIdFilter.upperId = parseInt(event.target.value);
        newIdFilter.idFilterExpression = `${this.state.idFilter.lowerIdOpen ? '(' : '['}${this.state.idFilter.lowerId ? this.state.idFilter.lowerId : '~'}, ` + event.target.value + `${this.state.idFilter.upperIdOpen ? ')' : ']'}`;
        this.setState({ idFilter: newIdFilter });
    }

    /**
     * 选中左右闭或开间（大于或大于等于 id 范围）单选框
     * @param lowerIdOpen true|false(不包含|包含)，理解为集合的左开或闭区间
     * @param upperIdOpen true|false(不包含|包含)，理解为集合的右开或闭区间
     */
    handleIdBound(lowerIdOpen: boolean, upperIdOpen: boolean): void {
        let newIdFilter = new IdFilterType();
        newIdFilter.rangeType = RangeTypeEnum.BOUND;
        newIdFilter.lowerIdOpen = lowerIdOpen;
        newIdFilter.upperIdOpen = upperIdOpen;
        this.setState({ idFilter: newIdFilter });
    }


    render(): JSX.Element {
        return (
            <div className={`zain-message-filter${this.props.className ? ' '+this.props.className : ''}`}>
                <span className="message-filter-id">
                    <input
                        className="id-edit-input"
                        type="text"
                        name="id"
                        autoComplete="off"
                        title={this.state.idFilter.idFilterExpression ? this.state.idFilter.idFilterExpression : ''}
                        value={this.state.idFilter.idFilterExpression ? this.state.idFilter.idFilterExpression : ''}
                        disabled={(this.state.name || this.state.mail || this.state.content || this.state.time) ? true : false}
                        onChange={() => {}}
                        onFocus={(event: React.FocusEvent<HTMLInputElement>) => { this.onIdEditInputFocus(event); }}
                    />
                    {
                        this.state.showIdFilter &&
                        <div className="id-condition-query">
                            <span className="id-query-line id-only">
                                <input
                                    className="id-input-radio"
                                    type="radio"
                                    name="boundQuery"
                                    value="bound"
                                    checked={this.state.idFilter.rangeType === RangeTypeEnum.ONLY}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.handleIdOnlyRadio(event); }}
                                />
                                <span>&nbsp;id =&nbsp;</span>
                                <input
                                    className="id-input-text"
                                    type="text"
                                    name="idQuery"
                                    value={this.state.idFilter.id ? this.state.idFilter.id : ''}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.handleIdOnlyInput(event); }}
                                />
                            </span>
                            <span className="id-query-line id-lower-bound">
                                <input
                                    className="id-input-radio"
                                    type="radio"
                                    name="boundQuery"
                                    value="bound"
                                    checked={this.state.idFilter.rangeType === RangeTypeEnum.LOWERBOUND && this.state.idFilter.lowerIdOpen === false}
                                    onChange={() => { this.handleIdLowerBound(false); }}
                                />
                                <span>&nbsp;{'id >='}&nbsp;</span>
                                <input
                                    className="id-input-text"
                                    type="text"
                                    name="idQuery"
                                    value={(this.state.idFilter.lowerId && this.state.idFilter.rangeType === RangeTypeEnum.LOWERBOUND && this.state.idFilter.lowerIdOpen === false) ? this.state.idFilter.lowerId : ''}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.handleIdLowerBoundInput(event); }}
                                />
                                &nbsp;&nbsp;&nbsp;
                                <input
                                    className="id-input-radio"
                                    type="radio"
                                    name="boundQuery"
                                    value="bound"
                                    checked={this.state.idFilter.rangeType === RangeTypeEnum.LOWERBOUND && this.state.idFilter.lowerIdOpen === true}
                                    onChange={() => { this.handleIdLowerBound(true); }}
                                />
                                <span>&nbsp;{'id >'}&nbsp;</span>
                                <input
                                    className="id-input-text"
                                    type="text"
                                    name="idQuery"
                                    value={(this.state.idFilter.lowerId && this.state.idFilter.rangeType === RangeTypeEnum.LOWERBOUND && this.state.idFilter.lowerIdOpen === true) ? this.state.idFilter.lowerId : ''}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.handleIdLowerBoundInput(event); }}
                                />
                            </span>
                            <span className="id-query-line id-upper-bound">
                                <input
                                    className="id-input-radio"
                                    type="radio"
                                    name="boundQuery"
                                    value="bound"
                                    checked={this.state.idFilter.rangeType === RangeTypeEnum.UPPERBOUND && this.state.idFilter.upperIdOpen === false}
                                    onChange={() => { this.handleIdUpperBound(false); }}
                                />
                                <span>&nbsp;{'id <='}&nbsp;</span>
                                <input
                                    className="id-input-text"
                                    type="text" name="idQuery"
                                    value={(this.state.idFilter.upperId && this.state.idFilter.rangeType === RangeTypeEnum.UPPERBOUND && this.state.idFilter.upperIdOpen === false) ? this.state.idFilter.upperId : ''}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.handleIdUpperBoundInput(event); }}
                                />
                                &nbsp;&nbsp;&nbsp;
                                <input
                                    className="id-input-radio"
                                    type="radio"
                                    name="boundQuery"
                                    value="bound"
                                    checked={this.state.idFilter.rangeType === RangeTypeEnum.UPPERBOUND && this.state.idFilter.upperIdOpen === true}
                                    onChange={() => { this.handleIdUpperBound(true); }}
                                />
                                <span>&nbsp;{'id <'}&nbsp;</span>
                                <input
                                    className="id-input-text"
                                    type="text"
                                    name="idQuery"
                                    value={(this.state.idFilter.upperId && this.state.idFilter.rangeType === RangeTypeEnum.UPPERBOUND && this.state.idFilter.upperIdOpen === true) ? this.state.idFilter.upperId : ''}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.handleIdUpperBoundInput(event); }}
                                />
                            </span>
                            <span className="id-query-line id-bound">
                                <input
                                    className="id-input-radio"
                                    type="radio"
                                    name="boundQuery"
                                    value="bound"
                                    checked={this.state.idFilter.rangeType === RangeTypeEnum.BOUND && this.state.idFilter.lowerIdOpen === false && this.state.idFilter.upperIdOpen === false}
                                    onChange={() => { this.handleIdBound(false, false); }}
                                />&nbsp;
                                <input
                                    className="id-input-text"
                                    type="text"
                                    name="idQuery"
                                    value={(this.state.idFilter.lowerId && this.state.idFilter.rangeType === RangeTypeEnum.BOUND && this.state.idFilter.lowerIdOpen === false && this.state.idFilter.upperIdOpen === false) ? this.state.idFilter.lowerId : ''}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.handleIdLowerBoundInput(event); }}
                                />
                                <span>&nbsp;{'<= id <='}&nbsp;</span>
                                <input
                                    className="id-input-text"
                                    type="text"
                                    name="idQuery"
                                    value={(this.state.idFilter.upperId && this.state.idFilter.rangeType === RangeTypeEnum.BOUND && this.state.idFilter.lowerIdOpen === false && this.state.idFilter.upperIdOpen === false) ? this.state.idFilter.upperId : ''}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.handleIdUpperBoundInput(event); }}
                                />
                            </span>
                            <span className="id-query-line id-bound">
                                <input
                                    className="id-input-radio"
                                    type="radio"
                                    name="boundQuery"
                                    value="bound"
                                    checked={this.state.idFilter.rangeType === RangeTypeEnum.BOUND && this.state.idFilter.lowerIdOpen === true && this.state.idFilter.upperIdOpen === false}
                                    onChange={() => { this.handleIdBound(true, false); }}
                                />&nbsp;
                                <input
                                    className="id-input-text"
                                    type="text"
                                    name="idQuery"
                                    value={(this.state.idFilter.lowerId && this.state.idFilter.rangeType === RangeTypeEnum.BOUND && this.state.idFilter.lowerIdOpen === true && this.state.idFilter.upperIdOpen === false) ? this.state.idFilter.lowerId : ''}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.handleIdLowerBoundInput(event); }}
                                />
                                <span>&nbsp;{'< id <='}&nbsp;</span>
                                <input
                                    className="id-input-text"
                                    type="text"
                                    name="idQuery"
                                    value={(this.state.idFilter.upperId && this.state.idFilter.rangeType === RangeTypeEnum.BOUND && this.state.idFilter.lowerIdOpen === true && this.state.idFilter.upperIdOpen === false) ? this.state.idFilter.upperId : ''}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.handleIdUpperBoundInput(event); }}
                                />
                            </span>
                            <span className="id-query-line id-bound">
                                <input
                                    className="id-input-radio"
                                    type="radio"
                                    name="boundQuery"
                                    value="bound"
                                    checked={this.state.idFilter.rangeType === RangeTypeEnum.BOUND && this.state.idFilter.lowerIdOpen === false && this.state.idFilter.upperIdOpen === true}
                                    onChange={() => { this.handleIdBound(false, true); }}
                                />&nbsp;
                                <input
                                    className="id-input-text"
                                    type="text"
                                    name="idQuery"
                                    value={(this.state.idFilter.lowerId && this.state.idFilter.rangeType === RangeTypeEnum.BOUND && this.state.idFilter.lowerIdOpen === false && this.state.idFilter.upperIdOpen === true) ? this.state.idFilter.lowerId : ''}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.handleIdLowerBoundInput(event); }}
                                />
                                <span>&nbsp;{'<= id <'}&nbsp;</span>
                                <input
                                    className="id-input-text"
                                    type="text"
                                    name="idQuery"
                                    value={(this.state.idFilter.upperId && this.state.idFilter.rangeType === RangeTypeEnum.BOUND && this.state.idFilter.lowerIdOpen === false && this.state.idFilter.upperIdOpen === true) ? this.state.idFilter.upperId : ''}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.handleIdUpperBoundInput(event); }}
                                />
                            </span>
                            <span className="id-query-line id-bound">
                                <input
                                    className="id-input-radio"
                                    type="radio"
                                    name="boundQuery"
                                    value="bound"
                                    checked={this.state.idFilter.rangeType === RangeTypeEnum.BOUND && this.state.idFilter.lowerIdOpen === true && this.state.idFilter.upperIdOpen === true}
                                    onChange={() => { this.handleIdBound(true, true); }}
                                />&nbsp;
                                <input
                                    className="id-input-text"
                                    type="text"
                                    name="idQuery"
                                    value={(this.state.idFilter.lowerId && this.state.idFilter.rangeType === RangeTypeEnum.BOUND && this.state.idFilter.lowerIdOpen === true && this.state.idFilter.upperIdOpen === true) ? this.state.idFilter.lowerId : ''}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.handleIdLowerBoundInput(event); }}
                                />
                                <span>&nbsp;{'< id <'}&nbsp;</span>
                                <input
                                    className="id-input-text"
                                    type="text"
                                    name="idQuery"
                                    value={(this.state.idFilter.upperId && this.state.idFilter.rangeType === RangeTypeEnum.BOUND && this.state.idFilter.lowerIdOpen === true && this.state.idFilter.upperIdOpen === true) ? this.state.idFilter.upperId : ''}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.handleIdUpperBoundInput(event); }}
                                />
                            </span>
                            <span className="id-query-line id-query-button">
                                <span className="query-prompt-text">先选中单选框再输入值哦^_^</span>
                                <button className="id-query-cancel" onClick={() => { this.handleIdQueryCancel(); }}>取消</button>
                                <button className="id-query-confirm" onClick={() => { this.handleIdQueryConfirm(); }}>确定</button>
                            </span>
                        </div>
                    }
                </span>
                <span className="message-filter-name">
                    <input
                        className="name-edit-input"
                        type="text"
                        name="name"
                        value={this.state.name}
                        disabled={(this.state.idFilter.idFilterExpression || this.state.content || this.state.time) ? true : false}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.onChangeNameEdit(event) }}
                    />
                </span>
                <span className="message-filter-mail">
                    <input
                        className="mail-edit-input"
                        type="text"
                        name="mail"
                        value={this.state.mail}
                        disabled={(this.state.idFilter.idFilterExpression || this.state.content || this.state.time) ? true : false}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.onChangeMailEdit(event) }}
                    />
                </span>
                <span className="message-filter-content">
                    <input
                        className="content-edit-input"
                        type="text"
                        name="content"
                        value={this.state.content}
                        disabled={(this.state.idFilter.idFilterExpression || this.state.name || this.state.mail || this.state.time) ? true : false}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { this.onChangeContentEdit(event) }}
                    />
                </span>
                <span className="message-filter-time">
                    <input
                        className="time-edit-input"
                        type="text"
                        name="time"
                        value={this.state.time}
                        disabled={(this.state.idFilter.idFilterExpression || this.state.name || this.state.mail || this.state.content) ? true : false}
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
