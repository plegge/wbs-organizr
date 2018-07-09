import React, { Component } from 'react'
import styled from 'styled-components'

const Overlay = styled.div`
    width: 20px;
    height: 100%;
    background-color: #121212;
    transition: all 200ms ease;
    overflow: hidden;
    color: #fff;
    transition: all 200ms ease;

    &:hover {
        width: 300px;
    }
`

const List = styled.ul`
    min-width: 300px
    box-sizing: border-box;
    margin: 20px 0px 0px;
    list-style: none;
    padding: 0px;
`

const Project = styled.li`
    margin: 0px;
    padding: 12px 36px;
    background-color: ${props => props.selected ? '#222' : 'transparent' }

    &:hover {
        background-color: #333;
    }
`

export default class ProjectsList extends Component {
    selectProject = (project) => {
        const projectsList = this.state
            .projectsList
            .map(p => Object.assign({}, p, { selected: (p.id === project.id) }))

        this.setState({ projectsList })
    }

    state = {
        projectsList: [
            { id: 1, title: 'Project #1', selected: false },
            { id: 2, title: 'Project #2', selected: false },
            { id: 3, title: 'Project #3', selected: false },
            { id: 4, title: 'Project #4', selected: false },
            { id: 5, title: 'Project #5', selected: false },
        ]
    }

    render() {
        return <Overlay>
            <List>{this.state.projectsList
                .map(project =>
                    <Project
                        key={project.id}
                        selected={project.selected}
                        onClick={() => this.selectProject(project)}>
                        {project.title}
                    </Project>
                )}
            </List>
        </Overlay>
    }
}
