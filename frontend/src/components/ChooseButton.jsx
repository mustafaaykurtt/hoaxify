import React from 'react'

const ChooseButton = (props) => {

    const {error} = props;

    return (
        <div>
            <label htmlFor="inputField" className="btn btn-info">
                Choose File
            </label>
            <input
                type="file"
                id="inputField"
                style={{ display: 'none' }}
            />
            <div className="invalid-feedback"> {error} </div>
        </div>
    )
}

export default ChooseButton