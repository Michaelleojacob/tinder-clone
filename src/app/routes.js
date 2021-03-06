// eslint-disable-next-line
import { app, auth, db } from './firebase-utils/firebase';
import App from './app';
import SwipeArea from './components/swipeArea/swipeAreaMain';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LandingPage from './components/landingPage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
  updateBasedOnAuth,
  updateStateOnLogIn,
  updateUid,
} from './redux-store/userState';
import { isUserSignedIn, getUid } from './firebase-utils/auth';
import { useDispatch } from 'react-redux';
import EditProfile from './components/editProfile';
import { getUser } from './firebase-utils/firestoreUser';
import Chatrooms from './components/chatrooms/chatrooms';
import { testPhotos } from './firebase-utils/firebasePhotos';
import {
  getChatRooms,
  addChatRoomsListener,
} from './firebase-utils/firebase-chatrooms';
//! delete once done with mocks
// import { useMockHumans } from './utils/useMockHumans';

const AppRoutes = () => {
  //! delete once done with mocks
  // useMockHumans();
  const [authState, setAuthState] = useState(isUserSignedIn());
  const dispatch = useDispatch();

  // dynamically logs in or logs out based on onAuthStateChanged();
  const handleLoggedInState = () => {
    dispatch(updateBasedOnAuth(isUserSignedIn()));
    dispatch(updateUid(getUid()));
    setAuthState(isUserSignedIn());
  };

  // updates localState when user logs in
  const fetchUserDataOnLogIn = async (uid) => {
    const allInfo = await Promise.all([
      getUser(uid),
      testPhotos(uid),
      getChatRooms(uid),
      addChatRoomsListener(uid),
    ]);
    console.log(allInfo);

    // ? the old approach
    // const userData = await getUser(uid);
    // dispatch(updateStateOnLogIn(userData));
  };

  /**
   * if user logs in, fetch user data
   * if log in or log out, update log in state
   * on unmount, remove onAuthStateChanged
   */
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        fetchUserDataOnLogIn(user.uid);
      }
      handleLoggedInState();
    });
    return () => unSubscribe();
    // eslint-disable-next-line
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route element={<PrivateWrapper authState={authState} />}>
          <Route path='/edit/:uid' element={<EditProfile />} />
          <Route path='/swipe' element={<SwipeArea />} />
          <Route path='/rooms' element={<Chatrooms />} />
        </Route>
        <Route path='/landing' element={<LandingPage />} />
        <Route path='/*' element={<App />} />
      </Routes>
    </HashRouter>
  );
};

const PrivateWrapper = ({ authState }) => {
  return authState ? <Outlet /> : <Navigate to='/landing' />;
};

export default AppRoutes;
