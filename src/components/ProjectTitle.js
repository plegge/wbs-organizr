import React, { Component } from 'react'
import styled from 'styled-components'

const Title = styled.h1`
    font-size: 28px;
`

const Separator = () => ` | `

export default class ProjectTitle extends Component {
    render() {
        return <div>
            <Title>Project Title!</Title>

            <a href="">Save</a>
            <Separator />
            <a href="">Delete</a>
            <Separator />
            <a href="">New Project</a>
        </div>
    }
}
