import App from "../App.js";
import { jsTPS_Transaction } from "../common/jsTPS.js";
import { Song } from "../types.js";

export default class AddSong_Transaction extends jsTPS_Transaction {
    app: App
    index: number;

    constructor(initApp: App) {
        super();
        this.app = initApp;
        this.index = this.app.state.currentList!.songs.length;
    }

    doTransaction() {
        const newSong: Song = {
            title: "Untitled",
            artist: "Unknown",
            youTubeId: "dQw4w9WgXcQ"
        }
        this.app.addSongAtIndex(this.index, newSong);
    }
    
    undoTransaction() {
        this.app.deleteSongAtIndex(this.index);
    }
}