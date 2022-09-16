import React from "react";
import { Song } from "../types";

interface Props {
    id: number
    moveCallback: any
    deleteCallback: any
    editCallback: any
    song: Song | null
}

interface State {
    isDragging: boolean 
    draggedTo: boolean
}

export default class SongCard extends React.Component<Props, State> {
    constructor(props: Props | Readonly<Props>) {
        super(props);

        this.state = {
            isDragging: false,
            draggedTo: false,
        }
    }

    handleDeleteClick = () => {
        this.props.deleteCallback();
    }

    handleDoubleClick = () => {
        this.props.editCallback();
    }

    handleDragStart = (event: any) => {
        event.dataTransfer.setData("song", event.target.id);
        this.setState(prevState => ({
            isDragging: true,
            draggedTo: prevState.draggedTo
        }));
    }
    handleDragOver = (event: any) => {
        event.preventDefault();
        this.setState(prevState => ({
            isDragging: prevState.isDragging,
            draggedTo: true
        }));
    }
    handleDragEnter = (event: any) => {
        event.preventDefault();
        this.setState(prevState => ({
            isDragging: prevState.isDragging,
            draggedTo: true
        }));
    }
    handleDragLeave = (event: any) => {
        event.preventDefault();
        this.setState(prevState => ({
            isDragging: prevState.isDragging,
            draggedTo: false
        }));
    }
    handleDrop = (event: any) => {
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1);
        let sourceId = event.dataTransfer.getData("song");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        
        this.setState(prevState => ({
            isDragging: false,
            draggedTo: false
        }));

        // ASK THE MODEL TO MOVE THE DATA
        this.props.moveCallback(sourceId, targetId);
    }

    render() {
        const { id } = this.props;
        let cardClasses = "list-card unselected-list-card" + (this.state.draggedTo ? " playlister-song-dragged-to" : "");
        return (
            <div
                id={'song-' + (id + 1)}
                className={cardClasses}
                onDragStart={this.handleDragStart}
                onDragOver={this.handleDragOver}
                onDragEnter={this.handleDragEnter}
                onDragLeave={this.handleDragLeave}
                onDrop={this.handleDrop}
                draggable="true"
                onDoubleClick={this.handleDoubleClick}
            >
                {id+1}.&nbsp;
                <a href={"https://www.youtube.com/watch?v=" + this.props.song?.youTubeId}>
                    {this.props.song?.title} by {this.props.song?.artist}
                </a>

                <input 
                type="button" 
                id={"delete-song-" + (id + 1)}
                className="list-card-button" 
                value="X" 
                onClick={this.handleDeleteClick} />  
            </div>
        );
    }
}