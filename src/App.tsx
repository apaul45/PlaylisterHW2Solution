import React from 'react';
import './App.css';

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';
import jsTPS from './common/jsTPS.js';

// OUR TRANSACTIONS
import MoveSong_Transaction from './transactions/MoveSong_Transaction';

// THESE REACT COMPONENTS ARE MODALS
import DeleteListModal from './components/DeleteListModal';

// THESE REACT COMPONENTS ARE IN OUR UI
import { Playlist, Song } from './types';
import Banner from './components/Banner';
import EditToolbar from './components/EditToolbar';
import PlaylistCards from './components/PlaylistCards';
import SidebarHeading from './components/SidebarHeading';
import SidebarList from './components/SidebarList';
import Statusbar from './components/Statusbar';
import AddSong_Transaction from './transactions/AddSong_Transaction';
import DeleteSong_Transaction from './transactions/DeleteSong_Transaction';
import DeleteSongModal from './components/DeleteSongModal';
import EditSong_Transaction from './transactions/EditSongTransaction';
import EditSongModal from './components/EditSongModal';

interface State {
    listKeyPairMarkedForDeletion: Playlist | null,
    songMarkedForDeletion: number,
    songMarkedForEdit: number,
    currentList: Playlist | null,
    sessionData: any,
    canUndo: boolean, 
    canRedo: boolean, 
    canClose: boolean
}

interface Props {}


class App extends React.Component<Props, State> {
    tps: jsTPS;
    db: DBManager;
    constructor(props: Props) {
        super(props);

        // THIS IS OUR TRANSACTION PROCESSING SYSTEM
        this.tps = new jsTPS();

        // THIS WILL TALK TO LOCAL STORAGE
        this.db = new DBManager();

        // GET THE SESSION DATA FROM OUR DATA MANAGER
        let loadedSessionData = this.db.queryGetSessionData();

        // SETUP THE INITIAL STATE
        this.state = {
            listKeyPairMarkedForDeletion : null,
            songMarkedForDeletion: -1,
            songMarkedForEdit: -1,
            currentList : null,
            sessionData : loadedSessionData,
            canUndo: false, 
            canRedo: false, 
            canClose: false
        }
    }
    sortKeyNamePairsByName = (keyNamePairs: Array<Playlist>) => {
        keyNamePairs.sort((keyPair1, keyPair2) => {
            // GET THE LISTS
            return keyPair1.name.localeCompare(keyPair2.name);
        });
    }

    handleKeyDown = (event: KeyboardEvent) => {
        if (event.ctrlKey){
            if (event.keyCode === 90){
                this.undo();
                this.editToolbar();
            }
            else{
                if (event.keyCode === 89){
                    this.redo();
                    this.editToolbar();
                }
            }
        }
    }
    componentDidMount(){
        document.addEventListener('keydown', this.handleKeyDown);
    }
    componentWillUnmount(){
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
    createNewList = () => {
        // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
        let newKey = this.state.sessionData.nextKey;
        let newName = "Untitled" + newKey;

        // MAKE THE NEW LIST
        let newList = {
            key: newKey,
            name: newName,
            songs: []
        };

        // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
        // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTSte
        let newKeyNamePair = { "key": newKey, "name": newName };
        let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
        this.sortKeyNamePairsByName(updatedPairs);

        // CHANGE THE APP STATE SO THAT THE CURRENT LIST IS
        // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
        // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
        // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
        // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
        // SHOULD BE DONE VIA ITS CALLBACK
        this.setState((prevState: State) => ({
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            currentList: newList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey + 1,
                counter: prevState.sessionData.counter + 1,
                keyNamePairs: updatedPairs
            }
        }), () => {
            // PUTTING THIS NEW LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationCreateList(newList);

            // SO IS STORING OUR SESSION DATA
            this.db.mutationUpdateSessionData(this.state.sessionData);

            this.editToolbar();
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF DELETING A LIST.
    deleteList = (key: number) => {
        // IF IT IS THE CURRENT LIST, CHANGE THAT
        let newCurrentList: Playlist | null;
        if (this.state.currentList) {
                // THIS JUST MEANS IT'S NOT THE CURRENT LIST BEING
                // DELETED SO WE'LL KEEP THE CURRENT LIST AS IT IS
                newCurrentList =  this.state.currentList.key !== key ? this.state.currentList : null;
        }

        let keyIndex = this.state.sessionData.keyNamePairs.findIndex((keyNamePair: Playlist) => {
            return (keyNamePair.key === key);
        });
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        if (keyIndex >= 0)
            newKeyNamePairs.splice(keyIndex, 1);

        // AND FROM OUR APP STATE
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : null,
            currentList: newCurrentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter - 1,
                keyNamePairs: newKeyNamePairs,
            }
        }), () => {
            // DELETING THE LIST FROM PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationDeleteList(key);

            // SO IS STORING OUR SESSION DATA
            this.db.mutationUpdateSessionData(this.state.sessionData);
            this.editToolbar();
        });
    }
    deleteMarkedList = () => {
        this.deleteList(this.state.listKeyPairMarkedForDeletion!.key);
        this.hideDeleteListModal();
    }
    // THIS FUNCTION SPECIFICALLY DELETES THE CURRENT LIST
    deleteCurrentList = () => {
        if (this.state.currentList) {
            this.deleteList(this.state.currentList.key);
        }
    }
    renameList = (key: number, newName: string) => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (pair.key === key) {
                pair.name = newName;
            }
        }
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // WE MAY HAVE TO RENAME THE currentList
        let currentList = this.state.currentList;
        if (currentList!.key === key) {
            currentList!.name = newName;
        }

        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : null,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            let list = this.db.queryGetList(key);
            list.name = newName;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
            this.editToolbar();
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
    loadList = (key: number) => {
        let newCurrentList = this.db.queryGetList(key);
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            currentList: newCurrentList,
            sessionData: this.state.sessionData
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            this.tps.clearAllTransactions();
            this.editToolbar();
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
    closeCurrentList = () => {
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            currentList: null,
            sessionData: this.state.sessionData
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            this.tps.clearAllTransactions();
            this.editToolbar();
        });
    }
    setStateWithUpdatedList(list: Playlist) {
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            currentList : list,
            sessionData : this.state.sessionData
        }), () => {
            // UPDATING THE LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationUpdateList(this.state.currentList);
            this.editToolbar();
        });
    }
    getPlaylistSize = () => {
        return this.state.currentList!.songs.length;
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    moveSong(start: number, end: number) {
        let list = this.state.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        start -= 1;
        end -= 1;
        if (start < end) {
            let temp = list!.songs[start];
            for (let i = start; i < end; i++) {
                list!.songs[i] = list!.songs[i + 1];
            }
            list!.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list!.songs[start];
            for (let i = start; i > end; i--) {
                list!.songs[i] = list!.songs[i - 1];
            }
            list!.songs[end] = temp;
        }
        this.setStateWithUpdatedList(list!);
    }
    // THIS FUNCTION ADDS A MoveSong_Transaction TO THE TRANSACTION STACK
    addMoveSongTransaction = (start: number, end: number) => {
        let transaction = new MoveSong_Transaction(this, start, end);
        this.tps.addTransaction(transaction);
    }

    addSongAtIndex(index: number, song: Song) {
        const currentList = this.state.currentList;
        currentList!.songs.splice(index, 0, song);

        this.setState(prevState => ({
            currentList: currentList,
            sessionData: prevState.sessionData,
            listKeyPairMarkedForDeletion: prevState.listKeyPairMarkedForDeletion
        }), () => {
            this.db.mutationUpdateList(this.state.currentList);
            this.db.mutationUpdateSessionData(this.state.sessionData);
            this.editToolbar();
        });
    }

    addSongTransaction = (index: number) => {
        const newTransaction = new AddSong_Transaction(this);
        this.tps.addTransaction(newTransaction);
    }

    showDeleteSongModal = (index: number) => {
        console.log("reached");
        this.setState({
            songMarkedForDeletion: index
        }, () => {
            this.editToolbar();
        });
    }

    hideDeleteSongModal = () => {
        this.showDeleteSongModal(-1);
    }

    deleteSongAtIndex(index: number) {
        const currentList = this.state.currentList;
        currentList!.songs.splice(index, 1);

        this.setState(({
            currentList: currentList,
            songMarkedForDeletion: -1
        }), () => {
            this.db.mutationUpdateList(this.state.currentList);
            this.db.mutationUpdateSessionData(this.state.sessionData);
            this.editToolbar();
        });
    }
    
    deleteSongTransaction = () => {
        const newTransaction = new DeleteSong_Transaction(this, this.state.songMarkedForDeletion);
        this.tps.addTransaction(newTransaction);
    }


    setSongToEdit = (index: number) => {
        this.setState({
            songMarkedForEdit: index
        }, () => this.editToolbar());
    }

    editSongAtIndex = (song: Song, index: number) => {
        let newList = this.state.currentList;
        newList!.songs[index] = song;

        this.setState(({
            currentList: newList,
            songMarkedForEdit: -1
        }), () => {
            this.db.mutationUpdateList(this.state.currentList);
            this.db.mutationUpdateSessionData(this.state.sessionData);
            this.editToolbar();
        });
    }

    editSongTransaction = (song: Song) => {
        const newTransaction = new EditSong_Transaction(this, song, this.state.songMarkedForEdit);
        this.tps.addTransaction(newTransaction);
    }


    // THIS FUNCTION BEGINS THE PROCESS OF PERFORMING AN UNDO
    undo = () => {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();

            // MAKE SURE THE LIST GETS PERMANENTLY UPDATED
            this.db.mutationUpdateList(this.state.currentList);
            this.editToolbar();
        }
    }
    // THIS FUNCTION BEGINS THE PROCESS OF PERFORMING A REDO
    redo = () => {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();

            // MAKE SURE THE LIST GETS PERMANENTLY UPDATED
            this.db.mutationUpdateList(this.state.currentList);
            this.editToolbar();
        }
    }
    markListForDeletion = (keyPair: Playlist) => {
        this.setState(prevState => ({
            currentList: prevState.currentList,
            listKeyPairMarkedForDeletion : keyPair,
            sessionData: prevState.sessionData
        }), () => {
            // PROMPT THE USER
            this.showDeleteListModal();
            this.editToolbar();
        });
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    showDeleteListModal() {
        document.getElementById("delete-list-modal")!.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideDeleteListModal() {
        document.getElementById("delete-list-modal")!.classList.remove("is-visible");
    }

    editToolbar = () => {
        this.setState({
            canUndo: this.tps.hasTransactionToUndo(),
            canRedo: this.tps.hasTransactionToRedo(),
            canClose: this.state.currentList !== null
        });
    }

    render() {
        return (
            <div id="root">
                <Banner />
                <SidebarHeading
                    createNewListCallback={this.createNewList}
                />
                <SidebarList
                    currentList={this.state.currentList}
                    keyNamePairs={this.state.sessionData.keyNamePairs}
                    deleteListCallback={this.markListForDeletion}
                    loadListCallback={this.loadList}
                    renameListCallback={this.renameList}
                />
                <EditToolbar
                    canAddSong={this.state.currentList !== null}
                    canUndo={this.state.canUndo}
                    canRedo={this.state.canRedo}
                    canClose={this.state.canClose}
                    addSongCallback={this.addSongTransaction}
                    undoCallback={this.undo}
                    redoCallback={this.redo}
                    closeCallback={this.closeCurrentList}
                />
                <PlaylistCards
                    currentList={this.state.currentList}
                    moveSongCallback={this.addMoveSongTransaction}
                    deleteSongCallback={this.showDeleteSongModal} 
                    editSongCallback = {this.setSongToEdit}
                />
                <Statusbar 
                    currentList={this.state.currentList} />
                <DeleteListModal
                    listName={this.state.listKeyPairMarkedForDeletion !== null ? this.state.listKeyPairMarkedForDeletion.name : ""}
                    hideDeleteListModalCallback={this.hideDeleteListModal}
                    deleteListCallback={this.deleteMarkedList}
                />    
                <DeleteSongModal 
                songToDelete={this.state.songMarkedForDeletion >= 0 ? this.state.currentList!.songs[this.state.songMarkedForDeletion] : null} 
                deleteSongCallback={this.deleteSongTransaction}  
                hideDeleteModalCallback={this.hideDeleteSongModal}
                />     
                <EditSongModal
                songToEdit={this.state.songMarkedForEdit >= 0 ? this.state.currentList!.songs[this.state.songMarkedForEdit] : null}
                editSongCallback={this.editSongTransaction}
                hideEditModalCallback={this.setSongToEdit}  
                />
            </div>
        );
    }
}

export default App;
