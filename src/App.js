import React, { Component } from 'react'

import ProjectListContainer from './containers/ProjectListContainer'
import CurrentProjectContainer from './containers/CurrentProjectContainer'
import AppRoot from './components/AppRoot'

class App extends Component {
    render() {
        return <AppRoot>
            <ProjectListContainer />
            <CurrentProjectContainer />
        </AppRoot>
    }
}

export default App
