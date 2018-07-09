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
            .then(JSON.parse)
            .then(this.loadFromData)
            .then(this.addFirstProject)
            .catch(this.addFirstProject)
    }

    @computed
    get loaded() {
        return this.list.length > 0
    }

    @observable
    list = []

    @computed
    get selected() {
        this.saveData()
        return _first(this.list.filter(project => project.selected))
    }

    @action
    loadFromData = (data) => {
        if (data && data.length) {
            this.list = data
        }
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
        this.list = this.list.filter(project => project.id !== id)
        this.list.length
            ? this.selectProject(this.list[0].id)
            : this.addFirstProject()
    }

    addFirstProject = () => {
        if (!this.loaded || this.list.length === 0) {
            this.addProject('New Project')
        }
    }

    saveData = () => localStorage
        .setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(this.list))
}

const projectStore = new ProjectStore()

export default projectStore
