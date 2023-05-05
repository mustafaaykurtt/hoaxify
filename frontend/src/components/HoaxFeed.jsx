import { useEffect } from 'react';
import { useState } from 'react'
import { getHoaxes, getNewHoaxCount, getOldHoaxes } from '../api/apiCalls';
import { useTranslation } from 'react-i18next';
import HoaxView from './HoaxView';
import { useApiProgress } from '../shared/ApiProgress';
import { Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const HoaxFeed = () => {

    const [hoaxPage, setHoaxPage] = useState({ content: [], last: true, number: 0 });
    const { t } = useTranslation();
    const { username } = useParams();
    const [newHoaxCount, setNewHoaxCount] = useState(0);

    const path = username ? `/api/1.0/users/${username}/hoaxes?page=` : '/api/1.0/hoaxes?page='
    const initialHoaxLoadProgress = useApiProgress('get', path);

    let lastHoaxId = 0;
    let firstHoaxId = 0;
    if (hoaxPage.content.length > 0) {

        firstHoaxId = hoaxPage.content[0].id;

        const lastHoaxIndeks = hoaxPage.content.length - 1;
        lastHoaxId = hoaxPage.content[lastHoaxIndeks].id;
    }

    const oldHoaxPath = username ? `/api/1.0/users/${username}/hoaxes/${lastHoaxId}` : `/api/1.0/hoaxes/${lastHoaxId}`;
    const loadOldHoaxesProgress = useApiProgress('get', oldHoaxPath, true);

    useEffect(() => {
        const getCount = async () => {
            const response = await getNewHoaxCount(firstHoaxId);
            setNewHoaxCount(response.data.count);
        }
        let looper = setInterval(() => {
            getCount();
        }, 2000);
        return function cleanUp() {
            clearInterval(looper);
        }
    }, [firstHoaxId])

    useEffect(() => {
        const loadHoaxes = async (page) => {
            try {
                const response = await getHoaxes(username, page);
                setHoaxPage(prevHoaxPage => ({
                    ...response.data,
                    content: [...prevHoaxPage.content, ...response. bdata.content]
                }));
            } catch (error) { }
        }
        loadHoaxes();
    }, [username])

    const loadOldHoaxes = async () => {
        const response = await getOldHoaxes(lastHoaxId, username);
        setHoaxPage(prevHoaxPage => ({
            ...response.data,
            content: [...prevHoaxPage.content, ...response.data.content]
        }));
    }

    const { content, last } = hoaxPage;

    if (content.length === 0) {
        return <div className='alert alert-secondary text-center'>
            {initialHoaxLoadProgress ? <Spinner /> : t("There are no hoaxes")}
        </div>
    }

    return (
        <div>
            {newHoaxCount > 0 && <div className='alert alert-secondary text-center mb-1'>
                {t("There are new hoaxes")}
            </div>}
            {content.map((hoax, index) => {
                return <HoaxView key={`${hoax.id}-${index}`} hoax={hoax} />
            })}
            {!last && <div
                className='alert alert-secondary text-center'
                style={{ cursor: loadOldHoaxesProgress ? 'not-allowed' : 'pointer' }}
                onClick={loadOldHoaxesProgress ? () => { } : () => loadOldHoaxes()}>
                {loadOldHoaxesProgress ? <Spinner /> : t("Load all hoxes")}
            </div>}
        </div>
    )
}

export default HoaxFeed