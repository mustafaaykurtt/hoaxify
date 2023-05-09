import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ProfileImageWithDefault from './ProfileImageWithDefault';
import { useTranslation } from 'react-i18next';
import Input from '../components/Input'
import { deleteUser, updateUser } from '../api/apiCalls';
import { useApiProgress } from '../shared/ApiProgress';
import ButtonWithProgress from './ButtonWithProgress';
import { onLogoutSuccess, updateSuccess } from '../redux/features/user/userSlice';
import Modal from './Modal';


const ProfileCard = (props) => {

    const [inEditMode, setInEditMode] = useState(false);
    const [updatedDisplayName, setUpdatedDisplayName] = useState();
    const [newImage, setNewImage] = useState();
    const [validationErrors, setValidationErrors] = useState({});
    const loggedInUsername = useSelector(state => state.user.username);
    const [modalVisible, setModalVisible] = useState(false);
    const { username: pathUsername } = useParams();

    const [editable, setEditable] = useState(false);
    const [user, setUser] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setUser(props.user);
    }, [props.user]);

    useEffect(() => {
        setEditable(pathUsername === loggedInUsername);
    }, [pathUsername, loggedInUsername]);

    const { t } = useTranslation();
    const { username, displayName, image } = user;

    const pendingApiCallDeleteUser = useApiProgress('delete', `/api/1.0/users/${username}`, true)

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

    const onClickCancel = () => {
        setModalVisible(false);
    }

    const onClickDeleteUser = async () => {
        await deleteUser(username);
        setModalVisible(false);
        dispatch(onLogoutSuccess());
        navigate('/');
       
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
                                <>
                                    <button className='btn btn-success d-inline-flex' onClick={() => setInEditMode(true)}>
                                        <i className='material-icons'>edit</i>
                                        {t('Edit')}
                                    </button>
                                    <div className='pt-2'>
                                        <button className='btn btn-danger d-inline-flex' onClick={() => setModalVisible(true)}>
                                            <i className='material-icons'>directions_run</i>
                                            {t('Delete My Account')}
                                        </button>
                                    </div>
                                </>
                            )}
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
            <Modal
                visible={modalVisible}
                title={t('Delete My Account')}
                okButton={t('Delete My Account')}
                onClickCancel={onClickCancel}
                onClickOk={onClickDeleteUser}
                message={t('Are you sure to delete your account?')}
                pendingApiCall={pendingApiCallDeleteUser}
            />
        </div>
    )
}

export default ProfileCard