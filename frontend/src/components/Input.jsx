import React from 'react'

const Input = ({ label, error, name, onChange, type, defaultValue }) => {
    let className = 'form-control';

    if (type === 'file') {
        className += '-file'
    }

    if (error !== undefined) {
        className += ' is-invalid'
    }

    return (
        <div className='form-group mb-3'>
            <label>{label}</label>
            <input className={className} name={name} onChange={onChange} type={type} defaultValue={defaultValue} />
            <div className="invalid-feedback"> {error} </div>
        </div>
    )
}

export default Input;