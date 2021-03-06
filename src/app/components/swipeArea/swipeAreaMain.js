import { useState, useEffect } from 'react';
import DevNav from '../devNav';
import { getUsers } from '../../firebase-utils/firebase-getRanUsers';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkLocalUid,
  checkLocalUser,
  pushLikedUser,
} from '../../redux-store/userState';
import { shuffle } from '../../utils/shuffleArr';
import { useSwipeable } from 'react-swipeable';
import { getUser, updateLikedUsers } from '../../firebase-utils/firestoreUser';
import { createChatRoom } from '../../firebase-utils/firebase-chatrooms';

const config = {
  delta: 10,
  preventScrollOnSwipe: true,
  trackTouch: true,
  trackMouse: true,
  rotationAngle: 0,
  swipeDuration: Infinity,
  touchEventOptions: { passive: true },
};

const SwipeArea = () => {
  const [profiles, setProfiles] = useState([]);
  const [indx, setIndx] = useState(0);
  const userUid = useSelector(checkLocalUid);
  const user = useSelector(checkLocalUser);
  const dispatch = useDispatch();

  const incrementIndx = () => setIndx(indx + 1);
  const decrementIndx = () => setIndx(indx - 1);

  const checkForMatch = async (otherPersonUid) => {
    const p = await getUser(otherPersonUid);
    const { likedUsers, uid } = p;
    if (likedUsers.includes(userUid)) {
      const lol = [uid, userUid].sort((a, b) => b - a);

      createChatRoom(lol);
    }
  };

  const handleSwipeRight = useSwipeable({
    onSwipedRight: async () => {
      await updateLikedUsers(userUid, profiles[indx].uid);
      dispatch(pushLikedUser(profiles[indx].uid));
      checkForMatch(profiles[indx].uid);
      if (indx >= profiles.length - 1) return;
      incrementIndx();
    },
    ...config,
    onSwipedLeft: () => {
      if (indx >= profiles.length - 1) return;
      incrementIndx();
    },
    ...config,
  });

  useEffect(() => {
    const queryUsers = async () => {
      const profileArr = await getUsers();
      const { likedUsers } = user;
      const removeSelf = profileArr.filter((p) => p.uid !== userUid);
      const removeAlreadyLikedUser = removeSelf.filter(
        (p) => !likedUsers.includes(p.uid)
      );
      const shuffled = shuffle(removeAlreadyLikedUser);
      setProfiles([...shuffled]);
    };
    queryUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <DevNav />
      <div className='swipe-area-content p1 m-1'>
        {profiles.length ? (
          <div className='swipe-card' {...handleSwipeRight}>
            <div>{profiles[indx].first}</div>
            <div>{profiles[indx].uid}</div>
            {profiles[indx].mainPhoto ? (
              <img
                className='swipe-card-image'
                src={process.env.PUBLIC_URL + profiles[indx].mainPhoto}
                alt={profiles[indx].first + 'image'}></img>
            ) : null}
          </div>
        ) : null}
        <button
          className='border m-1 p-1'
          onClick={decrementIndx}
          disabled={indx <= 0}>
          prev
        </button>
        <button
          className='border m-1 p-1'
          onClick={incrementIndx}
          disabled={indx >= profiles.length - 1}>
          next
        </button>
        <button
          className='border m-1 p-1'
          onClick={() => console.log(profiles)}>
          log profiles arr
        </button>
      </div>
    </div>
  );
};
export default SwipeArea;
