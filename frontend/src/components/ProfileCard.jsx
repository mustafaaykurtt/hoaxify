import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ProfileImageWithDefault from './ProfileImageWithDefault';
import { useTranslation } from 'react-i18next';
import Input from '../components/Input'
import { updateUser } from '../api/apiCalls';
import { useApiProgress } from '../shared/ApiProgress';
import ButtonWithProgress from './ButtonWithProgress';
import { updateSuccess } from '../redux/features/user/userSlice';


const ProfileCard = (props) => {

    const [inEditMode, setInEditMode] = useState(false);
    const [updatedDisplayName, setUpdatedDisplayName] = useState();
    const [newImage, setNewImage] = useState();
    const [validationErrors, setValidationErrors] = useState({});
    const loggedInUsername = useSelector(state => state.user.username);
    const { username: pathUsername } = useParams();

    const [editable, setEditable] = useState(false);
    const [user, setUser] = useState({});
    const dispatch = useDispatch();

    useEffect(() => {
        setUser(props.user);
    }, [props.user]);

    useEffect(() => {
        setEditable(pathUsername === loggedInUsername);
    }, [pathUsername, loggedInUsername]);

    const { t } = useTranslation();
    const { username, displayName, image } = user;

    useEffect(() => {
        if (!inEditMode) {
            setUpdatedDisplayName(displayName);
            setNewImage(undefined)
        } else {
            setUpdatedDisplayName(displayName);
        }
    }, [inEditMode, displayName])

    useEffect(() => {
        setValidationErrors(prevValidationErrors => ({ ...prevValidationErrors, displayName: undefined }))
    }, [updatedDisplayName])

    useEffect(() => {
        setValidationErrors(prevValidationErrors => ({ ...prevValidationErrors, image: undefined }))
    }, [newImage])



    const onClickSave = async () => {
        let image;
        if (newImage) {
            image = newImage.split(',')[1]
        }

        const body = {
            displayName: updatedDisplayName,
            image
        };
        try {
            const response = await updateUser(username, body);
            setInEditMode(false);
            setUser(response.data);
            dispatch(updateSuccess(response.data));
        } catch (error) {
            if (error.response.data.validationErrors) {
                setValidationErrors(error.response.data.validationErrors);
            }
        }
    }

    const onChangefile = (event) => {
        if (event.target.files.length < 1) {
            return;
        }
        const file = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            setNewImage(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }

    const pendingApiCall = useApiProgress('put', '/api/1.0/users/' + username);

    const { displayName: displayNameError, image: imageError } = validationErrors;

    return (
        <div className='card text-center'>
            <div className='card-header'>
                <ProfileImageWithDefault
                    className='rounded-circle shadow'
                    width="200"
                    height="200"
                    alt={`${username} profile`}
                    image={image}
                    tempimage={newImage}
                />
            </div>
            <div className='card-body'>
                {!inEditMode &&
                    (
                        <>
                            <h3>
                                {displayName}@{username}
                            </h3>
                            {editable && (
                                <button className='btn btn-success d-inline-flex' onClick={() => setInEditMode(true)}>
                                    <i className='material-icons'>edit</i>
                                    {t('Edit')}
                                </button>)}
                        </>
                    )}
                {inEditMode && (
                    <div>
                        <Input
                            label={t("Change Display Name")}
                            defaultValue={displayName}
                            error={displayNameError}
                            onChange={event => { setUpdatedDisplayName(event.target.value) }}
                        />
                        <div >
                            <div className='d-flex'>
                                <Input type='file' onChange={onChangefile} error={imageError} />
                            </div>
                            <div>
                                <ButtonWithProgress
                                    className='btn btn-primary d-inline-flex'
                                    onClick={onClickSave}
                                    disabled={pendingApiCall}
                                    pendingApiCall={pendingApiCall}
                                    text={
                                        <>
                                            <i className='material-icons'>save</i>{t("Save")}
                                        </>
                                    }
                                />
                                <button
                                    className='btn btn-light d-inline-flex'
                                    style={{ marginLeft: '7px' }}
                                    disabled={pendingApiCall}
                                    onClick={() => setInEditMode(false)}>
                                    <i className='material-icons'>close</i>{t("Cancel")}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfileCard