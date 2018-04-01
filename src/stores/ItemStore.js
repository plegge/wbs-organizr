import { action, computed, observable } from 'mobx'

const config = {
    SELECT_NEW_ITEM: false,
    ROOT_ID: 'root',
}

class ItemStore {
    constructor() {
        this.addItem({
            id: 'root',
            title: 'Home',
            parentId: 0,
            selected: true,
            isRoot: true,
            showChildren: true,
        })
    }

    @observable
    _list = []

    @computed
    get list() {
        return this._list.filter(item => !item.deleted)
    }

    @action
    addItem = ({ id, title, parentId, selected, isRoot, deleted, showChildren }) => {
        if (id && this.list.map(item => item.id).includes(id)) {
            return id
        }

        const newItem = {
            title,
            parentId,
            id: id || Date.now(),
            selected: selected || false,
            isRoot: isRoot || false,
            deleted: deleted || false,
            showChildren: showChildren || true,
        }

        this._list = this._list.concat(newItem)

        config.SELECT_NEW_ITEM && this.selectItemById(newItem.id)

        return newItem.id
    }

    __doNotModify = (item) => item

    __findAndApply = (id, modifier, modifierForNot = this.__doNotModify) => this._list = this._list
        .map(item => item.id === id ? modifier(item) : modifierForNot(item))

    @action
    removeItemById = (id) => {
        if (id === config.ROOT_ID) {
            return
        }

        this.selectPreviousSibling()
        this.__findAndApply(id, (item) => ({ ...item, deleted: true }))
    }

    @action
    selectItemById = (id) => this.__findAndApply(id,
        (item) => ({ ...item, selected: true }),
        (item) => ({ ...item, selected: false })
    )

    @action
    setChildrenVisibilityById = (id, showChildren) => this.__findAndApply(id, (item) => ({
        ...item,
        showChildren,
    }))

    @action
    updateItemById = (id, newItem) => this.__findAndApply(id, (oldItem) => ({ ...newItem, id }))

    @computed
    get selectedItem() {
        return this.list
            .filter(item => item.selected)
            .reduce((value, item) => item, null)
    }

    findItemById = (id) => this.list
        .filter(item => item.id === id)
        .reduce((selected, current) => current, null)

    findItemsByParentId = (parentId) => this.list
        .filter(item => item.parentId === parentId)


    __getPrevious = (list, selectedId) => {
        return list.reduce(({ previous, found }, current) => ({
            found: found || current === selectedId,
            previous: found || current === selectedId ? previous : current,
        }), { previous: null, found: false })
    }

    @action
    selectPreviousSibling = () => {
        const {
            previous,
            found,
        } = this.__getPrevious(this
            .findItemsByParentId(this.selectedItem.parentId)
            .map(item => item.id),
            this.selectedItem.id)

        if (found && previous) {
            this.selectItemById(previous)
        } else if (!previous && this.selectedItem.id !== config.ROOT_ID) {
            this.selectItemById(this.selectedItem.parentId)
        }
    }

    @action
    selectNextSibling = () => {
        const {
            previous,
            found,
        } = this.__getPrevious(this
            .findItemsByParentId(this.selectedItem.parentId)
            .map(item => item.id)
            .reverse(),
            this.selectedItem.id)

        if (found && previous) {
            this.selectItemById(previous)
        } else if (!previous) {
            console.log('selecting selectFirstChild')
            this.selectFirstChild()
        }
    }

    @action
    selectParent = () => {
        if (this.selectedItem.id !== config.ROOT_ID) {
            this.selectItemById(this.selectedItem.parentId)
        }
    }

    @action
    selectFirstChild = () => {
        const childId = this.findItemsByParentId(this.selectedItem.id)
            .map(item => item.id)
            .reduce((selectedId, childId) => selectedId ? selectedId : childId, false)

        if (childId !== false) {
            this.selectItemById(childId)
        }
    }

    @action
    removeSelected = () => {
        this.removeItemById(this.selectedItem.id)
    }
}

export default ItemStore
export const ROOT_ID = config.ROOT_ID
