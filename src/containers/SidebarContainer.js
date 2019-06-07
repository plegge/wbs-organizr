import React, { Component } from 'react'
import { observer } from 'mobx-react'

import SidebarList from '../components/SidebarList'

import schemaStore from '../stores/SchemaStore'

@observer
export default class SidebarContainer extends Component {
    onClickAdd() {
        const url = prompt('JSON file url')
        url && schemaStore.loadSchema(url)
    }

    render() {
        return <SidebarList
            data={schemaStore.list}
            onSelect={schemaStore.selectSchema}
            onClickAdd={this.onClickAdd}
            />
    }
}
