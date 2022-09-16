import { Component } from 'react';

interface Props {
    listName: string
    deleteListCallback: any
    hideDeleteListModalCallback: any
}

export default class DeleteListModal extends Component<Props> {
    render() {
        return (
            <div 
                className="modal" 
                id="delete-list-modal" 
                data-animation="slideInOutLeft">
                    <div className="modal-root" id='verify-delete-list-root'>
                        <div className="modal-north">
                            Delete playlist?
                        </div>
                        <div className="modal-center">
                            <div className="modal-center-content">
                                Are you sure you wish to permanently delete the {this.props.listName} playlist?
                            </div>
                        </div>
                        <div className="modal-south">
                            <input type="button" 
                                id="delete-list-confirm-button" 
                                className="modal-button" 
                                onClick={this.props.deleteListCallback}
                                value='Confirm' />
                            <input type="button" 
                                id="delete-list-cancel-button" 
                                className="modal-button" 
                                onClick={this.props.hideDeleteListModalCallback}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
        );
    }
}