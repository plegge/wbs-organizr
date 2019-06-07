import axios from 'axios'
import { observable, computed, action } from 'mobx'

class SchemaStore {
    @observable
    list = []

    loadSchema(url) {
        axios.get(url).then(res => this.addSchema(res.data))
    }

    @action.bound
    addSchema(schema) {
        this.list.push(schema)
    }
}

const schemaStore = new SchemaStore()

export default schemaStore
