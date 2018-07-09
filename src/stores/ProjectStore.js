import {
    action,
    observable,
    computed,
} from 'mobx'
import _first from 'lodash/first'

const LOCAL_STORAGE_PROJECTS_KEY = 'lspk'

const getNextId = () => Date.now()

class ProjectStore {
    constructor() {
        const initialData = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY)
        Promise.resolve(initialData)
            .then(data => JSON.parse(data))
            .then(data => data && data.length && this.loadFromData(data))
            .then(loadedData => !loadedData && this.addProject('New Project'))
            .catch(console.log)
    }

    @observable
    loaded = false

    @observable
    list = []

    @computed
    get selected() {
        return _first(this.list.filter(project => project.selected))
    }

    @action
    loadFromData = (data) => {
        this.list = data
        this.loaded = true
    }

    @action
    addProject = (title) => {
        const id = getNextId()

        this.list.push({
            id,
            title,
            selected: true,
        })

        this.selectProject(id)
        this.loaded = true
    }

    @action
    selectProject = (id) => {
        this.list = this.list.map(item => {
            item.selected = item.id === id
            return item
        })
    }

    @action
    removeProject = (id) => {
        const selectLatest = this.selected.id === id
        this.list = this.list.filter(project => project.id !== id)
    }
}

const projectStore = new ProjectStore()

export default projectStore
