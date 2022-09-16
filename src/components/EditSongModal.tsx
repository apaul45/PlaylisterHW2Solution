import { useEffect, useState } from "react";
import { Song } from "../types"

interface Props {
    songToEdit: Song | null 
    editSongCallback: any 
    hideEditModalCallback : any
}

export default function EditSongModal(props: Props) {
    const { songToEdit } = props;
    const visibility = songToEdit !== null ? "is-visible" : "";

    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [ytId, setYtId] = useState("");

    //Need useEffect hook to set state variables to their default values (identify when song prop changes)
    //Needed because useState doesn't change default values between renders
    useEffect(() => {
        setTitle(songToEdit as Song ? songToEdit!.title : "");
        setArtist(songToEdit as Song ? songToEdit!.artist : "");
        setYtId(songToEdit as Song ? songToEdit!.youTubeId :  "");
    }, [songToEdit])


    const updateSong = () => {
        const song: Song = {
            title: title, 
            artist: artist, 
            youTubeId: ytId
        };
        props.editSongCallback(song);
    }
    
    return (
        <div className={"modal " + visibility} id='edit-song-dialog'>
            <div className="modal-root">
                <div className="modal-north">
                    Edit Song
                </div>                
                <div className="modal-center">
                    <div className="modal-center-content">
                        Title: <input className="edit-song-modal-title-textfield" id="edit-song-title" onChange={(event) => setTitle(event.target.value)} defaultValue={title}/>
                        <br/>
                        Artist: <input className="edit-song-modal-artist-textfield" id="edit-song-artist" onChange={(event) => setArtist(event.target.value)} value={artist}/>
                        <br/>
                        YouTube Id: <input className="edit-song-modal-youTubeId-textfield" id="edit-yt-id" onChange={(event) => setYtId(event.target.value)} value={ytId}/>
                    </div>
                </div>
                <div className="modal-south">
                    <input 
                    type="button" 
                    id="edit-song-confirm-button" 
                    className="modal-button"
                    value='Confirm' 
                    onClick={() => updateSong()}/>

                    <input 
                    type="button" 
                    id="edit-song-cancel-button" 
                    className="modal-button" 
                    value='Cancel'
                    onClick={() => props.hideEditModalCallback(-1)} />
                </div>
            </div>
    </div>
    );
}