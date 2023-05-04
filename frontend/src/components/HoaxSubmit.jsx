import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import ProfileImageWithDefault from './ProfileImageWithDefault';
import { useTranslation } from 'react-i18next';
import { postHoax } from '../api/apiCalls';
import { useApiProgress } from '../shared/ApiProgress';
import ButtonWithProgress from './ButtonWithProgress';


const HoaxSubmit = () => {

    const { image } = useSelector(state => state.user);
    const [focused, setFocused] = useState(false);
    const [hoax, setHoax] = useState('');
    const { t } = useTranslation();
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!focused) {
            setHoax('')
            setErrors({});
        }
    }, [focused] )

    useEffect(() => {
        setErrors({});
    }, [hoax])

    const pendingApiCall = useApiProgress('post', '/api/1.0/hoaxes');

    const onClickHoaxify = async () => {
        const body = {
            content: hoax
        }

        try {
            await postHoax(body)
            setFocused(false);
        } catch (error) {
            if (error.response.data.validationErrors) {
                setErrors(error.response.data.validationErrors);
            }
        }
    }

    let textAreaClass = 'form-control';
    if (errors.content) {
        textAreaClass = ' is-invalid'
    }

    return (
        <div className='card p-1 flex-row'>
            <ProfileImageWithDefault image={image} width="32" height="32" className="rounded-circle" />
            <div className='d-flex flex-column flex-fill' style={{ marginLeft: "4px" }}>
                <textarea
                    className={textAreaClass}
                    rows={focused ? "3" : "1"}
                    onFocus={() => setFocused(true)}
                    onChange={(event) => setHoax(event.target.value)}
                    value={hoax}
                />
                <div className="invalid-feedback"> {errors.content} </div>
                {focused && (<div className='d-flex justify-content-end mt-2'>
                    <ButtonWithProgress
                        className='btn btn-primary'
                        onClick={onClickHoaxify}
                        text="Hoaxify"
                        pendingApiCall={pendingApiCall}
                        disabled={pendingApiCall}
                    />
                    <button
                        className='btn btn-light d-inline-flex'
                        style={{ marginLeft: '7px' }}
                        disabled={pendingApiCall}
                        onClick={() => setFocused(false)}>
                        <i className='material-icons'>close</i>{t("Cancel")}
                    </button>
                </div>)}
            </div>
        </div>
    )
}

export default HoaxSubmit