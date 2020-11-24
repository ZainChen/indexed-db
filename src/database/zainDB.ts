/**
 * IndexedDB存储二次封装库
 */
export class ZainDB {
    /**
     * IndexedDB存储二次封装库
     * @param name 数据库名
     * @param version 数据库版本号（只能升级，不能降级，不能使用浮点数，例如：2.4 会被置为 2）
     * @param objectTables 所有对象表（要添加对象表，须升级数据库版本号，否则需要在控制台手动删除数据库重新加载。修改已创建的对象表，升版本号也没用，要手动删除数据库重新加载）
     */
    constructor(name: string, version: number, objectTables: ZainObjectTable[]) {
        this.name = name;
        this.version = version;
        this.objectTables = objectTables;
        this.open(name, version);
    }

    /** 数据库名 */
    private name: string;

    /** 数据库版本号 */
    private version: number;

    /** 准备创建的所有对象表 */
    private objectTables: ZainObjectTable[];

    /** 数据库打开后的请求 */
    private requestOpen: IDBOpenDBRequest;

    /** 已经打开的数据库实例 */
    private database: IDBDatabase;

    /** 标记数据库是否是已打开状态 */
    private isOpen: boolean = false;

    /**
     * 创建或打开数据库
     * @param name 数据库名
     * @param version 数据库版本号
     */
    private open(name: string, version: number): void {
        if (!this.isBrowserSupport()) {
            console.error('当前浏览器不支持 indexedDB ！');
            // 这里预留日志、上报等接入能力
            return;
        }

        this.requestOpen = indexedDB.open(name, version);

        // 监听数据库打开失败
        this.requestOpen.onerror = (event: Event) => {
            console.error('数据库打开失败：', event);
            // 这里预留日志、上报等接入能力
        };

        // 监听数据库打开成功（第一次打开数据库时，先触发 upgradeneeded 事件）
        this.onDatabaseOpenSuccess((event: Event) => {
            console.log('onsuccess', '数据库打开成功：', event);
        });

        // 监听数据库版本号升级（指定的版本号，大于数据库的实际版本号，触发该事件）
        this.requestOpen.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            console.log('onupgradeneeded', '数据库版本号升级成功：', event);
            const target = event.target as IDBOpenDBRequest;
            this.database = target.result;
            this.createObjectTable();
        };
    }

    /**
     * 判断当前浏览器是否支持 indexedDB
     * @return true | false (支持 | 不支持)
     */
    isBrowserSupport(): boolean {
        if (!window.indexedDB) {
            return false;
        }
        return true;
    }

    /**
     * 监听数据库打开成功（第一次打开数据库时，先触发 upgradeneeded 事件）
     * @param func 数据库打开成功后的回调函数（打开成功后，才能操作数据[增删查改等]）
     */
    public onDatabaseOpenSuccess(func: (event: Event) => void): void {
        if (this.requestOpen) {
            this.requestOpen.onsuccess = (event: Event) => {
                this.database = this.requestOpen.result;
                this.isOpen = true;
                console.log('onsuccess', '数据库打开成功：', event);
                func(event);
            };
        }
    }

    /**
     * 创建对象仓库（创建表）
     */
    private createObjectTable(): void {
        if (this.objectTables) {
            for (let i = 0; i < this.objectTables.length; i++) {
                let objectStore;
                if (!this.database.objectStoreNames.contains(this.objectTables[i].tableName)) {
                    objectStore = this.database.createObjectStore(this.objectTables[i].tableName, {
                        keyPath: this.objectTables[i].keyPath,
                        autoIncrement: this.objectTables[i].autoIncrement
                    });
                    for (let j = 0; j < this.objectTables[i].tableIndex.length; j++) {
                        objectStore.createIndex(this.objectTables[i].tableIndex[j], this.objectTables[i].tableIndex[j]);
                    }
                    console.log('已添加对象表：', this.objectTables[i].tableName);
                }
            }
        }
    }

    /**
     * 往指定对象表中添加数据（支持添加多条和单条）
     * @param tableName 对象表名
     * @param datas 准备添加的数据
     * @param func 所有数据完成完成后的回调函数
     */
    public add<T>(tableName: string, datas: T, func: (event: Event) => void): void {
        if (!this.isOpen) {
            console.log('数据库未打开！');
            return;
        }
        const transaction = this.database.transaction([tableName], 'readwrite');
        // 监听所有数据添加完毕
        transaction.oncomplete = (event: Event) => {
            console.log('所有数据添加完毕：', event);
            func(event);
        };

        // 监听数据添加异常
        transaction.onerror = (event: Event) => {
            console.error('数据添加异常：', event);
            // 这里预留日志、上报等接入能力
            func(event);
        };

        const objectStore = transaction.objectStore(tableName);

        if (Array.isArray(datas)) {
            for (let i = 0; i < datas.length; i++) {
                const request = objectStore.add(datas[i]);
                request.onsuccess = (event: Event) => {
                    console.log('当前数据添加成功：', event);
                };
            }
        } else {
            const request = objectStore.add(datas);
            request.onsuccess = (event: Event) => {
                console.log('当前数据添加成功：', event);
            };
        }
    }

    /**
     * 游标查询，监听获取指定对象表所有数据
     * @param tableName 对象表名
     * @param func 数据查询完成后的回调函数，返回所有数据
     */
    public onGetDataAll<T>(tableName: string, func: (datas: T[]) => void): void {
        if (!this.isOpen) {
            console.log('数据库未打开！');
            return;
        }
        let datas: T[] = [];
        const objectStore = this.database.transaction([tableName]).objectStore(tableName);
        const request = objectStore.openCursor();
        request.onsuccess = (event) => {
            const requestSucces: IDBRequest = event.target as IDBRequest;
            const cursor = requestSucces.result;
            if (cursor) {
                datas.push(cursor.value);
                cursor.continue();
            }
            else {
                func(datas);
            }
        };
    }

    /**
     * 删除指定对象表中，指定主键数据
     * @param tableName 对象表名
     * @param keyPath 主键(keyPath)值
     * @param func 数据库删除完成后的回调函数
     */
    public deleteData(tableName: string, keyPath: IDBValidKey | IDBKeyRange, func: (event: Event) => void): void {
        if (!this.isOpen) {
            console.log('数据库未打开！');
            return;
        }
        const objectStore = this.database.transaction([tableName], 'readwrite').objectStore(tableName);
        const request = objectStore.delete(keyPath);

        // 监听数据库删除成功
        request.onsuccess = (event: Event) => {
            console.log('数据删除成功：', keyPath, event);
            func(event);
        }

        // 监听数据库删除失败
        request.onerror = (event: Event) => {
            console.error('数据删除失败：', keyPath, event);
            // 这里预留日志、上报等接入能力
            func(event);
        }
    }

    /**
     * 更新指定对象表中，指定数据
     * @param tableName 对象表名
     * @param data 准备更新的数据
     * @param func 数据库更新完成后的回调函数
     */
    public updateData<T>(tableName: string, data: T, func: (event: Event) => void): void {
        if (!this.isOpen) {
            console.log('数据库未打开！');
            return;
        }
        const objectStore = this.database.transaction([tableName], 'readwrite').objectStore(tableName);
        const request = objectStore.put(data);

        // 监听数据库更新成功
        request.onsuccess = (event: Event) => {
            console.log('数据更新成功：', event);
            func(event);
        }

        // 监听数据库更新失败
        request.onerror = (event: Event) => {
            console.error('数据更新失败：', event);
            // 这里预留日志、上报等接入能力
            func(event);
        }
    }

}

/**
 * 对象表类型
 */
export class ZainObjectTable {
    /** 对象表名 */
    tableName: string;
    /** 对象表的所有属性 */
    tableIndex: string[];
    /** 表属性种的主键 */
    keyPath?: string | string[] | null;
    /** 主键是否值自动增加 */
    autoIncrement?: boolean;
}
