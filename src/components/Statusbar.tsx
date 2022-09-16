import React from "react";
import { Playlist } from "../types";

export default class Statusbar extends React.Component<{currentList: Playlist | null}> {
    render() {
        const { currentList } = this.props;
        const name = currentList ? currentList.name : "";
        
        return (
            <div id="playlister-statusbar">
                {name}
            </div>
        )
    }
}