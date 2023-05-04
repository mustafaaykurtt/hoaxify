import logo from '../assets/hoaxify.png'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { onLogoutSuccess } from '../redux/features/user/userSlice'
import ProfileImageWithDefault from './ProfileImageWithDefault'
import { useEffect, useRef, useState } from 'react'


const Topbar = () => {
    const { username, displayName, image, isLoggedIn } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [menuVisible, setMenuVisible] = useState(false);
    const menuArea = useRef(null);

    useEffect(() => {
        document.addEventListener('click', menuClickTracker);
        return () => {
            document.removeEventListener('click', menuClickTracker)
        }
    }, [isLoggedIn]);

    const menuClickTracker = (event) => {
        if (menuArea.current === null || !menuArea.current.contains(event.target)) {
            setMenuVisible(false);
        }
    }

    let links = () => {
        return (
            <ul className='navbar-nav' style={{ marginLeft: 'auto' }}>
                <li>
                    <Link to="/login" className='nav-link'>
                        {t("Login")}
                    </Link>
                </li>
                <li>
                    <Link to="/signup" className='nav-link'>
                        {t("Sign Up")}
                    </Link>
                </li>
            </ul>
        )
    }
    if (isLoggedIn) {
        let dropDownClass = 'dropdown-menu p-0 shadow';
        if (menuVisible) {
            dropDownClass += ' show'
        }
        links = () => {
            return (
                <ul className='navbar-nav' style={{ marginLeft: 'auto' }} ref={menuArea}>
                    <li>
                        <div className='d-flex' style={{ cursor: 'pointer' }} onClick={() => setMenuVisible(true)}>
                            <ProfileImageWithDefault
                                image={image}
                                width="32"
                                height="32"
                                className="rounded-circle m-auto" />
                            <span className='nav-link dropdown-toggle'>{displayName}</span>
                        </div>
                        <div className={dropDownClass}>
                            <Link
                                to={`/user/${username}`} onClick={() => setMenuVisible(false)} className='dropdown-item d-flex'>
                                <i className='material-icons text-info'
                                    style={{marginRight : '5px'}}>person</i>{t("My Profile")}
                            </Link>
                            <span
                                className='dropdown-item d-flex'
                                style={{ cursor: 'pointer' }} onClick={() => dispatch(onLogoutSuccess())}>
                                <i className='material-icons text-danger' style={{
                                    marginRight
                                        : '5px'
                                }}>power_settings_new</i>
                                {t("Logout")}
                            </span>
                        </div>
                    </li>
                </ul>
            )
        }
    }

    return (
        <div className='shadow-sm bg-light mb-2'>
            <nav className="navbar navbar-light container navbar-expand ">
                <Link to="/" className="navbar-brand">
                    <img src={logo} alt="logo" width="60" />Hoaxify</Link>
                {links()}

            </nav>
        </div>
    )
}

export default (Topbar);