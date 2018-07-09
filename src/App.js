import React, { Component } from 'react'
import { observer } from 'mobx-react'
import ListItem from './components/ListItem'
import ProjectTitle from './components/ProjectTitle'
import ProjectsList from './components/ProjectsList'
import ItemStore, { ROOT_ID } from './stores/ItemStore'
import styled from 'styled-components'

const itemStore = new ItemStore()

const AppRoot = styled.div`
    margin: 0px;
    padding: 0px;
    width: 100%;
    height: 100%;
    display: flex;
`

const ProjectDescription = styled.div`
    width: 100%;
    box-sizing: border-box;
    margin-left: 20px;
`

@observer
class App extends Component {
    handleKeys = (e) => {
        const commands = {
            'ArrowUp': () => {
                itemStore.selectLastChildFromPreviousSibling()
                || itemStore.selectPreviousSibling()
                || itemStore.selectParent()
            },
            'ArrowDown': () => {
                itemStore.selectFirstChild()
                || itemStore.selectNextSibling()
                || itemStore.selectNextParentSibling()
            },
            'ArrowLeft': () => {
                itemStore.hideChildrenFromSelected()
                || itemStore.selectParent()
            },
            'ArrowRight': () => {
                itemStore.showChildrenFromSelected()
                || itemStore.selectFirstChild()
            },
            'Backspace': itemStore.removeSelected,
            'Delete': itemStore.removeSelected,
            'Enter': this.addSubItem,
        }

        Promise.resolve()
            .then(commands[e.key])
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeys, false)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeys, false)
    }

    addSubItem = (parentId = false) => {
        if (!parentId) {
            parentId = itemStore.selectedItem.id
        }

        const title = prompt('Item')

        if (!title) {
            return
        }

        itemStore.addItem({
            title,
            parentId,
        })
    }

    render() {
        const rootItem = itemStore.findItemById(ROOT_ID)

        return <AppRoot onKeyPress={this.handleKeys}>
            <ProjectsList />
            <ProjectDescription>
                <ProjectTitle />

                <ListItem item={rootItem}
                    id={rootItem.id}
                    key={rootItem.id}
                    store={itemStore}
                    addSubItem={this.addSubItem} />
            </ProjectDescription>
        </AppRoot>
    }
}

export default App
