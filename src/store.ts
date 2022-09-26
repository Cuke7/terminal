import { reactive } from 'vue'

interface app {
    name: String,
    url: String
}

export const apps = reactive({
    appsList: [] as app[]
})