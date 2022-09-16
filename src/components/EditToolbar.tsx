import React from "react";

interface Props {
    canAddSong: boolean 
    canUndo: boolean 
    canRedo: boolean 
    canClose: boolean 
    
    addSongCallback: any
    undoCallback: any 
    redoCallback: any 
    closeCallback: any
}

export default class EditToolbar extends React.Component<Props> {
    
    determineClass(enabled: boolean) {
        return enabled ? "playlister-button" : "playlister-button-disabled";
    }

    render() {
        return (
            <div id="edit-toolbar">
            <input 
                type="button" 
                id='add-song-button' 
                value="+" 
                className={this.determineClass(this.props.canAddSong)}
                onClick={this.props.addSongCallback}
            />
            <input 
                type="button" 
                id='undo-button' 
                value="⟲" 
                className={this.determineClass(this.props.canUndo)}
                onClick={this.props.undoCallback}
            />
            <input 
                type="button" 
                id='redo-button' 
                value="⟳" 
                className={this.determineClass(this.props.canRedo)} 
                onClick={this.props.redoCallback}
            />
            <input 
                type="button" 
                id='close-button' 
                value="&#x2715;" 
                className={this.determineClass(this.props.canClose)} 
                onClick={this.props.closeCallback}
            />
        </div>
        )
    }
}