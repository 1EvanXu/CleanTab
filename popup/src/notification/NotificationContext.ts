import { createContext } from "react";


export type CleanTaskType = {
    taskId: number,
    favicon?: string,
    title: string,
    url: string,
    count: number,
    cleand: boolean
}

export const NotificationContext = createContext({
    cleanMode: 'auto',
    cleanTasks: new Array<CleanTaskType>()
})