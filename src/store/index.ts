import { MessageStore } from "src/store/messageStore";

/**
 * indexed-db store 管理
 */
export class ManageStore {
    constructor() {
        // 实例化留言板 store
        this.messageStore = new MessageStore();
    }

    /** 留言板 store */
    public messageStore: MessageStore;
}
