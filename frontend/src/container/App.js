import UserSignupPage from '../pages/UserSignupPage';
import LoginPage from '../pages/LoginPage';
import LanguageSelector from '../components/LanguageSelector';
import HomePage from '../pages/HomePage';
import UserPage from '../pages/UserPage';
import Topbar from '../components/Topbar';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function App() {
const isLoggedIn = useSelector(state=>state.user.isLoggedIn);
  return (
    <div>
      <BrowserRouter>
        <Topbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={isLoggedIn ? <Navigate to='/'/> : <LoginPage />} />
          <Route path='/signup' element={isLoggedIn ? <Navigate to='/'/> : <UserSignupPage />} />
          <Route path='/user/:username' element={<UserPage />} />
          <Route path='*' element={<HomePage />} />
        </Routes>
      </BrowserRouter>
      
    </div>

  );
}

export default App;
