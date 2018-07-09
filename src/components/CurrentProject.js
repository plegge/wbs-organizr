import React, { Component } from 'react'
import Title from '../ui/Title'
import ProjectDescription from '../components/ProjectDescription'

export default class ProjectTitle extends Component {
    render() {
        const {
            data: {
                title,
            },
            children,
        } = this.props

        return title && <ProjectDescription>
            <Title>{title}</Title>
            {children}
        </ProjectDescription>
    }
}
