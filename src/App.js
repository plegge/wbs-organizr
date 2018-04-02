import React, { Component } from 'react'
import { observer } from 'mobx-react'
import './App.css'
import ListItem from './components/ListItem'
import ItemStore, { ROOT_ID } from './stores/ItemStore'

const itemStore = new ItemStore()

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

        if (Object.keys(commands).includes(e.key)) {
            commands[e.key]()
        }
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
        return <div className="App" onKeyPress={this.handleKeys}>
            <ListItem item={rootItem}
                id={rootItem.id}
                key={rootItem.id}
                store={itemStore}
                addSubItem={this.addSubItem} />
        </div>
    }
}

export default App
