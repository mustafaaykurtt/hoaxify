import React from 'react'
import ProfileImageWithDefault from './ProfileImageWithDefault';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { deleteHoax } from '../api/apiCalls';

const HoaxView = (props) => {
    const { hoax,onDeleteHoax } = props;
    
    const { user, content, timeStamp, fileAttachment, id } = hoax;
    const { username, displayName, image } = user;
    const loggedInUser = useSelector(state => state.user.username);

    const { i18n } = useTranslation();

    const onClickDelete = async () => {
        await deleteHoax(id);
        onDeleteHoax(id);
    }


    const formatted = format(timeStamp, i18n.language);

    const ownedByLoggedInUser = loggedInUser === username;

    return (
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
                    (<button className='btn btn-delete-link btn-sm' onClick={onClickDelete}>
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
    )
}

export default HoaxView