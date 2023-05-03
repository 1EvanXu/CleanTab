import { createContext } from "react";


export type CleanTaskType = {
    taskId: number
    url: string
    count: number
    cleand: boolean
}

export const CleanTaskListContext = createContext(new Array<CleanTaskType>())