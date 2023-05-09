import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import ProfileImageWithDefault from './ProfileImageWithDefault';
import { useTranslation } from 'react-i18next';
import { postHoax, postHoaxAttachment } from '../api/apiCalls';
import { useApiProgress } from '../shared/ApiProgress';
import ButtonWithProgress from './ButtonWithProgress';
import Input from '../components/Input'
import AutoUploadImage from './AutoUploadImage';


const HoaxSubmit = () => {

    const { image } = useSelector(state => state.user);
    const [focused, setFocused] = useState(false);
    const [hoax, setHoax] = useState('');
    const { t } = useTranslation();
    const [errors, setErrors] = useState({});
    const [newImage, setNewImage] = useState();
    const [attachmentId, setAttachmentId] = useState();


    useEffect(() => {
        if (!focused) {
            setHoax('')
            setErrors({});
            setNewImage();
            setAttachmentId();
        }
    }, [focused])

    useEffect(() => {
        setErrors({});
    }, [hoax])

    const pendingApiCall = useApiProgress('post', '/api/1.0/hoaxes', true);
    const pendingFileUpload = useApiProgress('post', '/api/1.0/hoax-attachments', true)

    const onClickHoaxify = async () => {
        const body = {
            content: hoax,
            attachmentId:attachmentId
        }

        try {
            await postHoax(body)
            setFocused(false);
        } catch (error) {
            if (error.response.data.validationErrors) {
                setErrors(error.response.data.validationErrors);
            }
        }
    };

    const onChangefile = (event) => {
        if (event.target.files.length < 1) {
            return;
        }
        const file = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            setNewImage(fileReader.result);
            uploadFile(file)
        };
        fileReader.readAsDataURL(file);
    };

    const uploadFile = async (file) => {
        const attachment = new FormData();
        attachment.append('file', file);
        const response = await postHoaxAttachment(attachment);
        setAttachmentId(response.data.id)
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
                {focused && (
                    <>
                        <div className='mt-4'>
                            {!newImage && <Input type="file" onChange={onChangefile} />}
                            {newImage && <AutoUploadImage image={newImage} uploading={pendingFileUpload}/>}
                        </div>
                        <div className='d-flex justify-content-end mt-2'>
                            <ButtonWithProgress
                                className='btn btn-primary'
                                onClick={onClickHoaxify}
                                text="Hoaxify"
                                pendingApiCall={pendingApiCall}
                                disabled={pendingApiCall || pendingFileUpload}
                            />
                            <button
                                className='btn btn-light d-inline-flex'
                                style={{ marginLeft: '7px' }}
                                disabled={pendingApiCall || pendingFileUpload}
                                onClick={() => setFocused(false)}>
                                <i className='material-icons'>close</i>{t("Cancel")}
                            </button>
                        </div>
                    </>)}
            </div>
        </div>
    )
}

export default HoaxSubmit