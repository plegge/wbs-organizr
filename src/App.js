import React, { Component } from 'react'

import SidebarContainer from './containers/SidebarContainer'
import MainPageContainer from './containers/MainPageContainer'
import AppRoot from './ui/AppRoot'

class App extends Component {
    render() {
        return <AppRoot>
            <SidebarContainer />
            <MainPageContainer />
        </AppRoot>
    }
}

export default App
