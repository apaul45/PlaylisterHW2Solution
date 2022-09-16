import React from "react";

export default class SidebarHeading extends React.Component<{createNewListCallback : any}> {
    
    handleClick = (event: any) => {
        this.props.createNewListCallback();
    }

    render() {
        return (
            <div id="sidebar-heading">
                <input 
                    type="button" 
                    id="add-list-button" 
                    className="toolbar-button" 
                    onClick={this.handleClick}
                    value="+" />
                Your Playlists
            </div>
        );
    }
}