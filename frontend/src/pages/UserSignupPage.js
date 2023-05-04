import React, { useState } from 'react'
import Input from '../components/Input';
import { useTranslation } from 'react-i18next'
import ButtonWithProgress from '../components/ButtonWithProgress';
import { useApiProgress } from '../shared/ApiProgress';
import { useDispatch, useSelector } from 'react-redux';
import { setErrors, signUpHandler } from '../redux/features/user/userSlice';

const UserSignupPage = (props) => {

  const [userInputs, setUserInputs] = useState({
    username: null,
    displayName: null,
    password: null,
    passwordRepeat: null
  });
  const pendingApiCallSignUp  = useApiProgress('post', '/api/1.0/users');
  const pendingApiCallLogin  = useApiProgress('post', '/api/1.0/auth');
  const pendingApiCall = pendingApiCallSignUp || pendingApiCallLogin;

  const errors = useSelector(state => state.user.errors);
  const dispatch = useDispatch();

  const onChange = e => {
    const { name, value } = e.target;
    const newErrors = { ...errors, [name]: undefined };
    dispatch(setErrors(newErrors));
    setUserInputs(prevState => ({ ...prevState, [name]: value, }))
  }

  const onClickSignUp = async e => {
    e.preventDefault();
    const { username, displayName, password } = userInputs;
    const body = {
      username,
      displayName,
      password
    }
    dispatch(setErrors({}));
    dispatch(signUpHandler(body))
  }

  const { username, displayName, password } = errors;
  const {t} = useTranslation();

  let passwordRepeatError;
  (userInputs.password !== userInputs.passwordRepeat) && (passwordRepeatError = t('Password mismatch'));
    
  return (

    <div className='container' >
      <form>
        <h1 className='text-center'>{t('Sign Up')}</h1>
        <Input name="username" label={t("Username")} error={username} onChange={onChange} />
        <Input name="displayName" label={t("Display Name")} error={displayName} onChange={onChange} />
        <Input name="password" label={t("Password")} error={password} onChange={onChange} type='password' />
        <Input name="passwordRepeat" label={t("Password Repeat")} error={passwordRepeatError} onChange={onChange} type='password' />
        <div className='text-center'>
          <ButtonWithProgress
            disabled={pendingApiCall || passwordRepeatError !== undefined}
            onClick={onClickSignUp}
            pendingApiCall={pendingApiCall}
            text={t('Sign Up')}
          />
        </div>
      </form>
    </div>
  )
}


export default UserSignupPage;