import { BoundType, LowerBoundType, OnlyType, RangeTypeEnum, UpperBoundType, ZainDB, ZainObjectTable } from "src/database/zainDB";

/**
 * 留言板 store
 */
export class MessageStore {
    constructor() {
        this.openMessageDatabase();
    }

    /** IndexedDB 存储二次封装库 */
    public zainDB: ZainDB;

    /**
     * 打开或创建留言板数据库
     */
    private openMessageDatabase(): void {
        // 留言板数据库的对象表（这里只创建一个，可创建多个表）
        const messageObjectTables: ZainObjectTable[] = [
            { tableName: 'Message-Table', tableIndex: ['id', 'name', 'mail', 'content', 'time', 'name,mail'], keyPath: 'id',  autoIncrement: true}
        ];
        // let messageObjectTable = new ZainObjectTable();
        // messageObjectTable.tableName = 'Message-Table';
        // messageObjectTable.tableIndex = ['name', 'mail', 'content', 'time'];
        // messageObjectTable.keyPath = 'id';
        // messageObjectTable.autoIncrement = true;
        // messageObjectTables.push(messageObjectTable);
        // 创建留言板数据库
        this.zainDB = new ZainDB('ZainMessage-DB', 1, messageObjectTables);
    }

    /**
     * 清空指定表中所有留言
     * @param func 清空完成后的回调函数
     */
    public clearMessage(func: (event: Event) => void): void {
        this.zainDB.clearTableData('Message-Table', (event: Event) => {
            func(event);
        });
    }

    /**
     * 添加留言
     * @param func 所有数据添加完成后的回调函数
     */
    public addMessage(func: (event: Event) => void): void {
        const messageTables: MessageTable = { name: 'zain', mail: '2384439266@qq.com', content: '嗨，哈喽！点击编辑，可以设置署名联系邮件和留言内容哦。', time: new Date().toLocaleString() };
        this.zainDB.add<MessageTable>('Message-Table', messageTables, (event: Event) => {
            func(event);
        });
        // 也可以一次添加多条数据
        // const messageTables: MessageTable[] = [
        //     { name: 'zain', mail: '2384439266@qq.com', content: '嗨，哈喽！点击编辑，可以设置署名联系邮件和留言内容哦。', time: new Date().toLocaleString() },
        //     { name: 'zain', mail: '2384439266@qq.com', content: '嗨，哈喽！点击编辑，可以设置署名联系邮件和留言内容哦。', time: new Date().toLocaleString() }
        // ];
        // this.zainDB.add<MessageTable[]>('Message-Table', messageTables, (event: Event) => {
        //     func(event);
        // });
    }

    /**
     * 获取当前查询到的所有留言数据
     * @param func 数据查询完成后的回调函数，返回所有数据
     */
    public getMessageDatas(func: (datas: MessageTable[]) => void): void {
        this.zainDB.readDataAll<MessageTable>('Message-Table', (datas: MessageTable[]) => {
            func(datas);
        });
    }

    /**
     * 指定主键(id)，删除留言
     * @param id 每条留言对应的 id
     * @param func 删除指定数据完成后的回调函数
     */
    public deleteMessage(id: number, func: (event: Event) => void): void {
        this.zainDB.deleteData('Message-Table', id, (event: Event) => {
            func(event);
        });
    }

    /**
     * 更新指定留言数据
     * @param data 新的留言数据
     * @param func 更新指定数据完成后的回调函数
     */
    public updateMessage(data: MessageTable, func: (event: Event) => void): void {
        this.zainDB.updateData<MessageTable>('Message-Table', data, (event: Event) => {
            func(event);
        });
    }

    /**
     * 条件搜索留言
     * @param messageFilter 搜索参数
     */
    public searchMessageDatas(messageFilter: MessageFilterType, func: (datas: MessageTable[]) => void): void {
        console.log('messageFilter', messageFilter);
        if (messageFilter.name && messageFilter.mail) {
            this.zainDB.searchOnlyDatas<MessageTable>('Message-Table', 'name,mail', [messageFilter.name, messageFilter.mail], (datas: MessageTable[]) => {
                func(datas);
            });
        } else if (messageFilter.name) {
            this.zainDB.searchOnlyDatas<MessageTable>('Message-Table', 'name', messageFilter.name, (datas: MessageTable[]) => {
                func(datas);
            });
        } else if (messageFilter.mail) {
            this.zainDB.searchOnlyDatas<MessageTable>('Message-Table', 'mail', messageFilter.mail, (datas: MessageTable[]) => {
                func(datas);
            });
        } else if (messageFilter.content) {
            this.zainDB.searchOnlyDatas<MessageTable>('Message-Table', 'content', messageFilter.content, (datas: MessageTable[]) => {
                func(datas);
            });
        } else if (messageFilter.time) {
            this.zainDB.searchOnlyDatas<MessageTable>('Message-Table', 'time', messageFilter.time, (datas: MessageTable[]) => {
                func(datas);
            });
        } else if (messageFilter.idFilter) {
            // this.zainDB.searchOnlyDatas<MessageTable>('Message-Table', 'id', messageFilter.id, (datas: MessageTable[]) => {
            //     func(datas);
            // });
            switch (messageFilter.idFilter.rangeType) {
                case RangeTypeEnum.ONLY:
                    const only: OnlyType = { value: messageFilter.idFilter.id };
                    this.zainDB.searchDatas<MessageTable>('Message-Table', 'id', RangeTypeEnum.ONLY, only, (datas: MessageTable[]) => {
                        func(datas);
                    });
                    break;
                case RangeTypeEnum.LOWERBOUND:
                    const lowerBound: LowerBoundType = { lower: messageFilter.idFilter.lowerId, open: messageFilter.idFilter.lowerIdOpen };
                    this.zainDB.searchDatas<MessageTable>('Message-Table', 'id', RangeTypeEnum.LOWERBOUND, lowerBound, (datas: MessageTable[]) => {
                        func(datas);
                    });
                    break;
                case RangeTypeEnum.UPPERBOUND:
                    const upperBound: UpperBoundType = { upper: messageFilter.idFilter.upperId, open: messageFilter.idFilter.upperIdOpen };
                    this.zainDB.searchDatas<MessageTable>('Message-Table', 'id', RangeTypeEnum.UPPERBOUND, upperBound, (datas: MessageTable[]) => {
                        func(datas);
                    });
                    break;
                case RangeTypeEnum.BOUND:
                    const bound: BoundType = {
                        lower: messageFilter.idFilter.lowerId,
                        lowerOpen: messageFilter.idFilter.lowerIdOpen,
                        upper: messageFilter.idFilter.upperId,
                        upperOpen: messageFilter.idFilter.upperIdOpen
                    };
                    this.zainDB.searchDatas<MessageTable>('Message-Table', 'id', RangeTypeEnum.BOUND, bound, (datas: MessageTable[]) => {
                        func(datas);
                    });
                    break;
            }
        }
    }
    
}

/**
 * 留言板表
 */
export class MessageTable {
    /** 每条留言对应的 id */
    id?: number;
    /** 姓名 */
    name: string;
    /** 邮箱 */
    mail: string;
    /** 内容 */
    content: string;
    /** 留言时间 */
    time: string;
}

/**
 * 留言表的 id 筛选类型
 */
export class IdFilterType {
    /** 条件查询，范围类型枚举 */
    rangeType?: RangeTypeEnum;
    /** id 筛选表达式 */
    idFilterExpression?: string;
    /** 固定 id 值 */
    id?: number;
    /** 最小 id 值 */
    lowerId?: number;
    /** 是否包含最小 id 值，true|false(不包含|包含)，理解为集合的左开或闭区间 */
    lowerIdOpen?: boolean;
    /** 最大 id 值 */
    upperId?: number;
    /** 是否包含最大 id 值，true|false(不包含|包含)，理解为集合的左开或闭区间 */
    upperIdOpen?: boolean;
}

/**
 * 留言表筛选确认后，参数返回值类型
 */
export class MessageFilterType {
    /** 留言表的 id 筛选参数 */
    idFilter: IdFilterType;
    /** 姓名 */
    name: string;
    /** 邮箱 */
    mail: string;
    /** 内容 */
    content: string;
    /** 留言时间 */
    time: string;
}
