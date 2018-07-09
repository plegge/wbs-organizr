import React, { Component } from 'react'
import { observer } from 'mobx-react'

import ProjectList from '../components/ProjectList'

import projectStore from '../stores/ProjectStore'

@observer
export default class ProjectListContainer extends Component {
    render() {
        return <ProjectList
            data={projectStore.list}
            addProject={projectStore.addProject}
            selectProject={projectStore.selectProject}
            />
    }
}
