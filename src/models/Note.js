import React from 'react';

function Note({ ID, User, VM, Title, Description }) {
    return (
        <div className="square">
            <div className="square-content">
                <h2>{Title}</h2>
                <p>{Description}</p>
            </div>
        </div>
    );
}

export default Note;