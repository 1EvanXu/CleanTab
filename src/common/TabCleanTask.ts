let TASK_COUNT = 0


export abstract class TabCleanTask {
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

    abstract count(): number

    newObject() {
        return {
            taskId: this.taskId,
            favicon: this.favicon,
            title: this.title,
            url: this.url,
            count: this.count(),
            cleand: this.cleaned
        }
    }
} 
