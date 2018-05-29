import React, { Component } from 'react'

const Separator = () => ` | `

export default class ProjectTitle extends Component {
    render() {
        return <div>
            <h1>Project Title!</h1>

            <a href="">Save</a>
            <Separator />
            <a href="">Delete</a>
            <Separator />
            <a href="">New Project</a>
            <br /><br /><br />
        </div>
    }
}
