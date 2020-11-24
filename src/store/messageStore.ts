import { ZainDB, ZainObjectTable } from "src/database/zainDB";

/**
 * 留言板 store
 */
export class MessageStore {
    constructor() {
        this.openMessageDatabase();
    }

    /** IndexedDB存储二次封装库 */
    public zainDB: ZainDB;

    /**
     * 打开或创建留言板数据库
     */
    private openMessageDatabase(): void {
        // 留言板数据库的对象表（这里只创建一个，可创建多个表）
        const messageObjectTables: ZainObjectTable[] = [
            { tableName: 'Message-Table', tableIndex: ['id', 'name', 'mail', 'content', 'time'], keyPath: 'id',  autoIncrement: true}
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
        //     { name: 'zain', mail: '2384439266@qq.com', content: '嗨，哈喽！', time: new Date().toLocaleString() }
        //     { name: 'zain', mail: '2384439266@qq.com', content: '嗨，哈喽！', time: new Date().toLocaleString() }
        // ];
        // this.zainDB.add<MessageTable[]>('Message-Table', messageTables);
    }

    /**
     * 监听获取当前查询到的所有留言数据
     * @param func 数据查询完成后的回调函数，返回所有数据
     */
    public onGetMessageDatas(func: (datas: MessageTable[]) => void): void {
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
     * 搜索指定留言
     * @param messageFilter 搜索参数
     */
    public searchOnlyMessageDatas(messageFilter: MessageTable): void {
        this.zainDB.searchOnlyDatas<MessageTable>('Message-Table', 'id', 3, (datas: MessageTable[]) => {
            console.log('zain>>>>>datasdatasdatas', datas);
        });
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
