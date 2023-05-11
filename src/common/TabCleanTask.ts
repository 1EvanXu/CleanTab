let TASK_COUNT = 0


export class TabCleanTask {
    private _taskId: number
    tabId: number = 0
    url?: string
    favicon?: string
    title?: string
    cleaned: boolean = false
    
    constructor() {
        TASK_COUNT++
        this._taskId = TASK_COUNT
    }

    get taskId() {
        return this._taskId
    }
} 
