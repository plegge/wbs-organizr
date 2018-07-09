import React, { Component } from 'react'
import { observer } from 'mobx-react'

import CurrentProject from '../components/CurrentProject'

import ItemListContainer from '../containers/ItemListContainer'

import projectStore from '../stores/ProjectStore'

@observer
export default class CurrentProjectContainer extends Component {
    render() {
        return projectStore.loaded
            && <CurrentProject data={projectStore.selected}>
                <ItemListContainer />
            </CurrentProject>
    }
}
