import App from "../App";
import { jsTPS_Transaction } from "../common/jsTPS";
import { Song } from "../types";

export default class EditSong_Transaction extends jsTPS_Transaction {
    app: App;
    newSong: Song;
    index: number;
    oldSong: Song | undefined;

    constructor(initApp: App, initSong: Song, initIndex: number) {
        super();
        this.app = initApp;
        this.newSong = initSong;
        this.index = initIndex;
        this.oldSong = this.app.state.currentList!.songs[initIndex];
    }
    undoTransaction() {
        this.app.editSongAtIndex(this.oldSong!, this.index);
    }
    doTransaction() {
        this.app.editSongAtIndex(this.newSong, this.index);
    }
}
