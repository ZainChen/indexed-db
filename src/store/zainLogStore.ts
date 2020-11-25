import { ZainDB, ZainObjectTable } from "src/database/zainDB";

/**
 * 志银版日志记录和上报;
 * 离线日志，上报到 indexedDB
 */
export class ZainLogStore {
    constructor() {
        this.openZainLogDatabase();
    }

    /** IndexedDB 二次封装库 */
    public zainDB: ZainDB;

    /**
     * 打开或创建志银日志数据库
     */
    private openZainLogDatabase(): void {
        const zainLogObjectTables: ZainObjectTable[] = [
            { tableName: 'ZainLog-Table', tableIndex: ['id', 'from', 'level', 'msg', 'version', 'time'], keyPath: 'id',  autoIncrement: true}
        ];
        this.zainDB = new ZainDB('ZainLog-DB', 1, zainLogObjectTables);
    }

    /**
     * 上报/添加日志
     * @param zainLog 上报的日志内容
     * @param func 所有数据添加完成后的回调函数
     */
    public addZainLog(zainLog: ZainLogTable, func: (event: Event) => void): void {
        const zainLogTable: ZainLogTable = {
            from: zainLog.from,
            level: zainLog.level,
            msg: zainLog.msg,
            version: '1.1.1',
            time: new Date().toLocaleString()
        };
        this.zainDB.add<ZainLogTable>('ZainLog-Table', zainLogTable, (event: Event) => {
            func(event);
        });
    }

    /**
     * 获取所有日志信息
     * @param func 日志信息查询完成后的回调函数，返回所有数据
     */
    public getZainLogDatas(func: (datas: ZainLogTable[]) => void): void {
        this.zainDB.readDataAll<ZainLogTable>('ZainLog-Table', (datas: ZainLogTable[]) => {
            func(datas);
        });
    }

    /**
     * 指定主键(id)，删除日志信息
     * @param id 每条日志信息对应的 id
     * @param func 删除指定数据完成后的回调函数
     */
    public deleteZainLog(id: number, func: (event: Event) => void): void {
        this.zainDB.deleteData('ZainLog-Table', id, (event: Event) => {
            func(event);
        });
    }

    /**
     * 清空指定表中所有日志信息
     * @param func 清空完成后的回调函数
     */
    public clearZainLog(func: (event: Event) => void): void {
        this.zainDB.clearTableData('ZainLog-Table', (event: Event) => {
            func(event);
        });
    }

    /**
     * 更新指定日志信息
     * @param data 新的日志信息
     * @param func 更新指定数据完成后的回调函数
     */
    public updateZainLog(data: ZainLogTable, func: (event: Event) => void): void {
        this.zainDB.updateData<ZainLogTable>('ZainLog-Table', data, (event: Event) => {
            func(event);
        });
    }

}

/**
 * 志银日志表（包含日志表所有属性）
 */
export class ZainLogTable {
    constructor(from: string, level: number, msg: string) {
        this.from = from;
        this.level = level;
        this.msg = msg;
    }
    /** 日志上报 id（上报日志的时候日志不填写，由数据库自动增加） */
    id?: number;
    /** 日志来源 */
    from: string;
    /** 日志等级 */
    level: number;
    /** 日志信息 */
    msg: string;
    /** 日志版本（上报日志的时候日志可以不填写，日志管理 store 里处理） */
    version?: string;
    /** 留言时间（上报日志的时候日志可以不填写，日志管理 store 里处理） */
    time?: string;
}
