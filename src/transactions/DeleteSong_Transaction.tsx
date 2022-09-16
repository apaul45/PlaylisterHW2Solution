import App from "../App.js";
import { jsTPS_Transaction } from "../common/jsTPS.js";
import { Song } from "../types.js";

export default class DeleteSong_Transaction extends jsTPS_Transaction {
    app: App
    index: number;
    song: Song;

    constructor(initApp: App, index: number) {
        super();
        this.app = initApp;
        this.index = index;
        this.song = this.app.state.currentList!.songs[index];
    }

    doTransaction() {
        this.app.deleteSongAtIndex(this.index);
    }
    
    undoTransaction() {
        this.app.addSongAtIndex(this.index, this.song);
    }
}