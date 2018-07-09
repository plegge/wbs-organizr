import React, { Component } from 'react'
import styled from 'styled-components'
import SideBar from '../ui/SideBar'
import Button from '../ui/Button'

export default class ProjectList extends Component {
    renderProject = (project) =>
        <ProjectItem
            key={project.id}
            selected={project.selected}
            onClick={this.onClickSelectProject(project)}
            >
            {project.title}
        </ProjectItem>

    onClickSelectProject = (project) => (e) => {
        e.preventDefault()

        const {
            selectProject
        } = this.props

        selectProject && selectProject(project.id)
    }

    onClickAddProject = (e) => {
        e.preventDefault()

        const {
            addProject
        } = this.props

        const title = prompt('Project Title:')

        addProject && title && addProject(title)
    }

    render() {
        const {
            data = [],
            addProject,
        } = this.props

        return <SideBar>
            {addProject && <AddProjectButton onClick={this.onClickAddProject}>Add Project</AddProjectButton>}
            <List>{data.map(this.renderProject)}</List>
        </SideBar>
    }
}

const List = styled.ul`
    box-sizing: border-box;
    margin: 20px 0px 0px;
    list-style: none;
    padding: 0px;
    min-width: 260px;
`

const ProjectItem = styled.li`
    margin: 0px;
    padding: 12px 24px;
    background-color: ${props => props.selected ? '#222' : 'transparent' }

    &:hover {
        background-color: #333;
    }
`

const AddProjectButton = styled(Button)`
    margin: 20px 20px 0px;
    text-overflow: ellipsis;
    min-width: 260px;
    overflow: hidden;
`
