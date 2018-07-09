import React, { Component } from 'react'
import { observer } from 'mobx-react'
import ListItem from '../components/ListItem'

import itemStore, { ROOT_ID } from '../stores/ItemStore'

@observer
export default class ItemListContainer extends Component {
    constructor(props) {
        super(props)
    }

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

        return <ListItem item={rootItem}
            onKeyPress={this.handleKeys}
            id={rootItem.id}
            key={rootItem.id}
            store={itemStore}
            addSubItem={this.addSubItem} />

    }
}
