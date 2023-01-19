import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  collection,
  getDocs,
  getFirestore,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { ITodo } from './types';

export let firebaseApp: FirebaseApp;

export const initializeAPI = (): FirebaseApp => {
  firebaseApp = initializeApp({
    apiKey: 'AIzaSyBZC6M262UtKG_vaTcVuHjuZ9cq7OlJq9E',
    authDomain: 'karpov-todo.firebaseapp.com',
    projectId: 'karpov-todo',
    storageBucket: 'karpov-todo.appspot.com',
    messagingSenderId: '917657628891',
    appId: '1:917657628891:web:a39c0be8ac8121f5735cfe',
  });

  getAuth(firebaseApp);
  getFirestore(firebaseApp);
  getStorage(firebaseApp);
  return firebaseApp;
};

const todoCollection = 'todos';

export const getTodos = async (): Promise<ITodo[]> => {
  const db = getFirestore();
  const todos: ITodo[] = [];

  try {
    const querySnapshot = await getDocs(collection(db, todoCollection));

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<ITodo, 'id'>;

      todos.push({
        id: doc.id,
        ...data,
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }

  return todos;
};

export const getUsersTodos = async (userId: string, completed: boolean): Promise<ITodo[]> => {
  const db = getFirestore();
  const todos: ITodo[] = [];

  try {
    const q = query(
      collection(db, todoCollection),
      where('user', '==', userId),
      where('completed', '==', completed),
      orderBy('created', 'desc')
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<ITodo, 'id'>;

      todos.push({
        id: doc.id,
        ...data,
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }

  return todos;
};

export const createTodo = async (data: Omit<ITodo, 'id'>): Promise<any> => {
  const db = getFirestore();
  const now = Timestamp.now();

  data.completed = false;
  data.created = now;

  try {
    await addDoc(collection(db, todoCollection), data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateTodo = async (id: string, data: Omit<ITodo, 'id'>): Promise<any> => {
  const db = getFirestore();
  const ref = doc(db, todoCollection, id);

  try {
    await updateDoc(ref, data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteTodo = async (id: string): Promise<any> => {
  const db = getFirestore();
  const ref = doc(db, todoCollection, id);

  try {
    await deleteDoc(ref);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const completeTodo = async (id: string, completed: boolean): Promise<any> => {
  const db = getFirestore();
  const ref = doc(db, todoCollection, id);

  try {
    await updateDoc(ref, { completed: completed });
  } catch (error) {
    return Promise.reject(error);
  }
};
