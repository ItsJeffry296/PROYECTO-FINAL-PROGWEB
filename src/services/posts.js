 import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

const postsCollection = collection(db, 'posts');

export async function createPost(content, userId, userEmail, userName) {
  try {
    const newPost = {
      content: content,
      userId: userId,
      userEmail: userEmail,
      userName: userName || userEmail.split('@')[0],
      createdAt: serverTimestamp(),
      likes: 0,
      comments: []
    };
    
    const docRef = await addDoc(postsCollection, newPost);
    return { id: docRef.id, ...newPost };
  } catch (error) {
    console.error('Error creando post:', error);
    throw error;
  }
}

export async function getPosts() {
  try {
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const posts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
      };
    });
    
    return posts;
  } catch (error) {
    console.error('Error obteniendo posts:', error);
    throw error;
  }
}
