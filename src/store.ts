import { reactive } from 'vue'

interface app {
    name: string,
    url: string
}

export const apps = reactive({
    appsList: [] as app[]
})