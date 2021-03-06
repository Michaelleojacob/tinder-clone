import { addPhotoToBucketAndDocs } from '../../firebase-utils/firestoreUser';
import { useDispatch } from 'react-redux';
import { addPhoto } from '../../redux-store/userState';

const UploadImage = ({ user, triggerUseEffect }) => {
  const dispatch = useDispatch();
  const handleChange = async (e) => {
    const res = await addPhotoToBucketAndDocs(user.uid, e.target.files[0]);
    dispatch(addPhoto(e.target.files[0].name));
    if (res) triggerUseEffect();
  };
  return (
    <input
      onChange={handleChange}
      className='m-1 p-1'
      type={'file'}
      accept='image/pngm image/jpeg'></input>
  );
};

export default UploadImage;
