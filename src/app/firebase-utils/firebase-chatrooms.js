import {
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

export const createChatRoom = async (uids) => {
  try {
    const name = `${uids[0]}-${uids[1]}`;
    await setDoc(doc(db, 'rooms', name), {
      name,
      chatUsers: [...uids],
      messages: [
        {
          msg: 'You both matched! Be the first to say something.',
          from: 'tinder-clone',
          timestamp: new Date(),
        },
      ],
    });
  } catch (e) {
    console.error(e);
  }
};

export const getChatRooms = async (uid) => {
  try {
    const collectionRef = collection(db, 'rooms');
    const rooms = query(
      collectionRef,
      where('chatUsers', 'array-contains', uid)
    );
    const snap = await getDocs(rooms);
    const chats = [];
    snap.forEach((doc) => chats.push(doc.data()));
    return chats;
  } catch (e) {
    console.error(e);
  }
};
// export const getChatRoomsWithListener = async (uid) => {
//   try {
//     const q = query(
//       collection(db, 'rooms'),
//       where('chatUsers', 'array-contains', uid)
//     );
//     const chats = [];
//     const unsubscribe = onSnapshot(q, (querySnapShot) => {
//       querySnapShot.forEach((doc) => chats.push(doc.data()));
//     });
//     return chats;
//   } catch (e) {
//     console.error(e);
//   }
// };
export const addChatRoomsListener = async (uid) => {
  try {
    const q = query(
      collection(db, 'rooms'),
      where('chatUsers', 'array-contains', uid)
    );
    return onSnapshot(q, (querySnapShot) => {
      querySnapShot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          console.log('added', change.doc.data());
          return getChatRooms(uid);
        }
        if (change.type === 'modified') {
          console.log('modified messages:', change.doc.data());
          return getChatRooms(uid);
        }
      });
      return getChatRooms(uid);
    });
  } catch (e) {
    console.error(e);
  }
};

/**
 * !this adds a subcollection, I am not longer going this route.
 */

// export const createChatRoom = async (uids) => {
//   try {
//     const name = `${uids[0]}-${uids[1]}`;
//     await setDoc(doc(db, 'rooms', name), {
//       name,
//       chatUsers: [...uids],
//     });
//     const docRef = doc(db, 'rooms', name);
//     const colRef = collection(docRef, 'messages');
//     await addDoc(colRef, {
//       msg: 'You both matched! Be the first to say something.',
//       from: 'tinder-clone',
//       timestamp: serverTimestamp(),
//     });
//   } catch (e) {
//     console.error(e);
//   }
// };

/**
 * !this was my attempt at getting a subcollection, which i gave up on
 */

// export const getChatRooms = async (uid) => {
//   try {
//     // const collectionRef = collection(db, 'rooms');
//     // const userChatRef = query(
//     //   collectionRef,
//     //   where('chatUsers', 'array-contains', uid)
//     // );
//     // const snapShot = await getDocs(userChatRef);
//     // const snapShot = await getDocs(collectionGroup(userChatRef, 'messages'));
//     // const messagesRef = query(collectionGroup(db, 'messages'));
//     // const snapShot = await getDocs(messagesRef);
//     // return snapShot.forEach((doc) => console.log(doc.data()));

//     const collectionRef = collection(db, 'rooms');
//     const rooms = query(
//       collectionRef,
//       where('chatUsers', 'array-contains', uid)
//     );
//     const snap = await getDocs(rooms);
//     snap.forEach((doc) => console.log(doc.data()));

//     // const messages = query(collectionGroup(db, 'messages'));
//     // const snap = await getDocs(messages);
//     // snap.forEach((doc) => console.log(doc.data()));
//   } catch (e) {
//     console.error(e);
//   }
// };
