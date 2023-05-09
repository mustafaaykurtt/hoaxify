import React, { useState } from 'react'
import ProfileImageWithDefault from './ProfileImageWithDefault';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { deleteHoax } from '../api/apiCalls';
import Modal from './Modal';
import { useApiProgress } from '../shared/ApiProgress';

const HoaxView = (props) => {
    const { hoax, onDeleteHoax } = props;

    const { user, content, timeStamp, fileAttachment, id } = hoax;
    const { username, displayName, image } = user;
    const loggedInUser = useSelector(state => state.user.username);
    const [modalVisible, setModalVisible] = useState(false);

    const {t,i18n } = useTranslation();

    const pendingApiCall = useApiProgress('delete', `/api/1.0/hoaxes/${id}`, true)

    const onClickDelete = async () => {
        await deleteHoax(id);
        onDeleteHoax(id);
        
    }

    const onClickCancel = () => {
        setModalVisible(false);
    }


    const formatted = format(timeStamp, i18n.language);

    const ownedByLoggedInUser = loggedInUser === username;

    return (
        <>
            <div className='card p-1'>
                <div className='d-flex'>
                    <ProfileImageWithDefault
                        image={image}
                        width="32" height="32"
                        className="rounded-circle m-1" />
                    <div className='flex-fill m-auto'>
                        <Link to={`/user/${username}`} className='text-dark' style={{ textDecoration: 'none' }} >
                            <h6 className='d-inline'
                                style={{ paddingLeft: '5px', }}>
                                {displayName}@{username}
                            </h6>
                            <span> - </span>
                            <span>{formatted}</span>
                        </Link>
                    </div>
                    {ownedByLoggedInUser &&
                        (<button className='btn btn-delete-link btn-sm' onClick={()=> setModalVisible(true)}>
                            <i className='material-icons'>delete_outline</i>
                        </button>)}
                </div>
                <div style={{ paddingLeft: '3rem', marginBottom: '5px' }}>
                    {content}
                </div>
                {fileAttachment && (
                    <div style={{ paddingLeft: '3rem' }}>
                        {fileAttachment.fileType.startsWith('image') && <img className='img-fluid' src={'/images/attachments/' + fileAttachment.name} alt={content} />}
                        {!fileAttachment.fileType.startsWith('image') && (
                            <strong>Hoax has unknown attachment</strong>
                        )}
                    </div>
                )}
            </div>
            <Modal
                visible={modalVisible}
                title={t('Delete Hoax')}
                onClickCancel={onClickCancel}
                onClickOk={onClickDelete}
                message={
                    <div>
                        <div>
                            <strong>{t('Are you sure to delete Hoax?')}</strong>
                        </div>
                        <span>{content}</span>
                    </div>
                }
                pendingApiCall={pendingApiCall}
                okButton={t('Delete Hoax')}
            />
        </>
    )
}

export default HoaxView