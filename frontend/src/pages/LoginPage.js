import React, { useEffect, useState } from 'react'
import Input from '../components/Input'
import { useTranslation } from 'react-i18next'
import ButtonWithProgress from '../components/ButtonWithProgress';
import { useApiProgress } from '../shared/ApiProgress';
import { useDispatch, useSelector } from 'react-redux';
import { loginHandler, setErrors } from '../redux/features/user/userSlice';

const LoginPage = () => {

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const  pendingApiCall  = useApiProgress('post', '/api/1.0/auth');
    const errors = useSelector(state => state.user.errors);
    const dispatch = useDispatch();
    
    useEffect(()=> {
        dispatch(setErrors({}));
    },[username, password, dispatch]);

    const onClickLogin = async e => {
        e.preventDefault();
        const creds = {
            username,
            password
        }
        dispatch(loginHandler(creds));
    }
    
    const {t} = useTranslation();
    const buttonEnabled = username && password;
    const {message} = errors || {};
    
    return (
        <div className='container'>
            <form>
                <h1 className='text-center'>{t('Login')}</h1>
                <Input label={t("Username")} name="username" onChange={e => setUsername(e.target.value)} />
                <Input label={t("Password")} name="password" type="password" onChange={e => setPassword(e.target.value)} />
                {message && <div className="alert alert-danger">{message}</div>}
                <div className='text-center'>
                    <ButtonWithProgress
                        onClick={onClickLogin}
                        disabled={!buttonEnabled || pendingApiCall}
                        pendingApiCall={pendingApiCall}
                        text={('Login')}
                    />
                </div>
            </form>
        </div>
    )
}

export default LoginPage;