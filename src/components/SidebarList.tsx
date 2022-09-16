import React from "react";
import { Playlist } from "../types";
import ListCard from "./ListCard";

interface Props {
    currentList: Playlist | null
    keyNamePairs: Array<Playlist> | null
    deleteListCallback: any
    loadListCallback: any
    renameListCallback: any
}

export default class SidebarList extends React.Component<Props> {
    render() {
        const { currentList,
                keyNamePairs,
                deleteListCallback, 
                loadListCallback,
                renameListCallback} = this.props;
        return (
            <div id="sidebar-list">
                {
                    keyNamePairs!.map((pair) => (
                        <ListCard
                        key={pair.key}
                        keyNamePair={pair}
                        selected={(currentList !== null) && (currentList.key === pair.key)}
                        deleteListCallback={deleteListCallback}
                        loadListCallback={loadListCallback}
                        renameListCallback={renameListCallback}
                        />
                    ))
                }x
            </div>
        );
    }
}