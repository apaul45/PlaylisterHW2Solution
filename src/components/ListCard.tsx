import React from "react";
import { Playlist } from "../types";

interface Props {
    key: number
    keyNamePair: Playlist | null
    selected: boolean
    deleteListCallback: any
    loadListCallback: any
    renameListCallback: any
}

interface State { 
    text: string 
    editActive: boolean
}

export default class ListCard extends React.Component<Props, State> {
    constructor(props: Props | Readonly<Props>) {
        super(props);

        this.state = {
            text: this.props.keyNamePair!.name,
            editActive: false,
        }
    }
    handleClick = (event: any) => {
        if (event.detail === 1) {
            this.handleLoadList(event);
        }
        else if (event.detail === 2) {
            this.handleToggleEdit(event);
        }
    }
    handleLoadList = (event: any) => {
        let listKey = event.target.id;
        if (listKey.startsWith("list-card-text-")) {
            listKey = listKey.substring("list-card-text-".length);
        }
        this.props.loadListCallback(listKey);
    }
    handleDeleteList = (event: any) => {
        event.stopPropagation();
        this.props.deleteListCallback(this.props.keyNamePair);
    }
    handleToggleEdit = (event?: any) => {
        this.setState({
            editActive: !this.state.editActive
        });
    }
    handleUpdate = (event: any) => {
        this.setState({ text: event.target.value });
    }
    handleKeyPress = (event: any) => {
        if (event.code === "Enter") {
            this.handleBlur();
        }
    }
    handleBlur = () => {
        let key = this.props.keyNamePair!.key;
        let textValue = this.state.text;
        console.log("ListCard handleBlur: " + textValue);
        this.props.renameListCallback(key, textValue);
        this.handleToggleEdit();
    }

    render() {
        const { keyNamePair, selected } = this.props;

        if (this.state.editActive) {
            return (
                <input
                    id={"list-" + keyNamePair!.name}
                    className='list-card'
                    type='text'
                    onKeyPress={this.handleKeyPress}
                    onBlur={this.handleBlur}
                    onChange={this.handleUpdate}
                    defaultValue={keyNamePair!.name}
                />)
        }
        else {

            let selectClass = "unselected-list-card";
            if (selected) {
                selectClass = "selected-list-card";
            }
            return (
                <div
                    id={keyNamePair!.key as unknown as string}
                    key={keyNamePair!.key}
                    onClick={this.handleClick}
                    className={'list-card ' + selectClass}>
                    <span
                        id={"list-card-text-" + keyNamePair!.key}
                        key={keyNamePair!.key}
                        className="list-card-text">
                        {keyNamePair!.name}
                    </span>
                    <input
                        type="button"
                        id={"delete-list-" + keyNamePair!.key}
                        className="list-card-button"
                        onClick={this.handleDeleteList}
                        value={"🗑"} />
                </div>
            );
        }
    }
}