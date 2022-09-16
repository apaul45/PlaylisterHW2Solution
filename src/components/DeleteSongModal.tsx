import { Song } from "../types"

interface Props {
    songToDelete: Song | null 
    deleteSongCallback: any
    hideDeleteModalCallback: any
}

export default function DeleteSongModal(props: Props) { 
    return (
        <div 
        className={"modal " + (props.songToDelete !== null ? "is-visible" : "")}
        id="delete-song-modal" 
        data-animation="slideInOutLeft">
            <div className="modal-root" id='verify-delete-song-root'>
                <div className="modal-north">
                    Delete song?
                </div>
                <div className="modal-center">
                    <div className="modal-center-content">
                        Are you sure you wish to permanently delete the {props.songToDelete?.title} song?
                    </div>
                </div>
                <div className="modal-south">
                    <input type="button" 
                        id="delete-song-confirm-button" 
                        className="modal-button" 
                        onClick={props.deleteSongCallback}
                        value='Confirm' />
                    <input type="button" 
                        id="delete-song-cancel-button" 
                        className="modal-button" 
                        onClick={props.hideDeleteModalCallback}
                        value='Cancel' />
                </div>
            </div>
        </div>
    )
};