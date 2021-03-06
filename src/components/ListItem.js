import React, { Component } from 'react'

class ListItem extends Component {
    editItem = (e = false) => {
        if (!this.props.item.selected) {
            this.props.store.selectItemById(this.props.id)
            return
        }

        const title = prompt('Item name', this.props.item.title)
        if (title) {
            this.props.store.updateItemById(this.props.id, {
                ...this.props.item,
                title,
            })
        }

    }

    addSubItem = () => this.props.addSubItem(this.props.id)

    toggleCheckItem = (e) => this.props
        .store
        .toggleCheckItem(this.props.id, !this.props.item.checked)

    toggleChildrenVisibility = () => this.props
        .store
        .setChildrenVisibilityById(this.props.id, !this.props.item.showChildren)

    render() {
        const {
            item,
            id,
            store,
        } = this.props

        const classNames = "ListItem" + (item.selected ? " selected" : "")

        const subItems = store.findItemsByParentId(id)

        return <div>
            <div className={classNames}>
                <span className="title">
                    <input type="checkbox" checked={item.checked} onChange={this.toggleCheckItem} />
                    <span  onClick={this.editItem}>{` ${item.title} `}</span>
                    <a onClick={this.toggleChildrenVisibility}>
                        ({subItems.length})
                    </a>
                </span>

                {item.selected && <span className="actions">
                    <button onClick={this.addSubItem}>+</button>
                </span>}
            </div>

            {item.showChildren
                && subItems.length > 0
                && <ul>{subItems.map(child => <ListItem item={child} id={child.id} key={child.id} store={store} />)}</ul>}
        </div>
    }
}

export default ListItem
