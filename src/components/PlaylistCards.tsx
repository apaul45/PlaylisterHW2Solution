import React from "react";
import { Playlist } from '../types.js';
import SongCard from "./SongCard";

interface Props {
    currentList: Playlist | null 
    moveSongCallback: any 
    deleteSongCallback: any
    editSongCallback: any
}

export default class PlaylistCards extends React.Component<Props> {

    //Must be outside render() to prevent infinite update cycle ("Maximum update depth exceeded" error)
    handleDeleteCallback = (index: number) => {
        this.props.deleteSongCallback(index);
    }

    handleEditCallback = (index: number) => {
        this.props.editSongCallback(index);
    }

    //Make sure its () => this.handleDeleteCallback to prevent the function from being called everytime the component re-renders
    //^Fix to "Maximum update depth exceeded error"
    render() {
        const { currentList } = this.props;
        return (
            <div id="playlist-cards">
                {
                    currentList !== null ?

                        currentList!.songs.map((song, index) => (
                            <SongCard
                                id={index}
                                key={index+1}
                                song={song}
                                moveCallback={this.props.moveSongCallback}
                                deleteCallback={() => this.handleDeleteCallback(index)}
                                editCallback={() => this.handleEditCallback(index)}
                            />
                        ))

                    : ""
                }
            </div>
        );
    }
}