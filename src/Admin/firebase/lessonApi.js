import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from './firebase';


export const uploadFile = async (file, folder) => {
  const fileRef = ref(storage, `${folder}/${file.name}`);
  await uploadBytes(fileRef, file);
  const fileURL = await getDownloadURL(fileRef);
  return fileURL;
};


export const addLesson = async (lessonData) => {
  try {
    // sublessons add first
    const features = await Promise.all(
      lessonData.features.map(async (sublesson) => {
        if (sublesson.file) {
          let fileURL = '';
          if (sublesson.type === 'video') {
            fileURL = await uploadFile(sublesson.file, 'videos');
          } else if (sublesson.type === 'document') {
            fileURL = await uploadFile(sublesson.file, 'documents');
          }
          return { ...sublesson, link: fileURL }; // Include file URL in sublesson data
        }
        return sublesson;
      })
    );

    
    await addDoc(collection(db, 'lessons'), {
      name: lessonData.name,
      features,  // Array of sublessons
      createdAt: Date.now()
    });

    console.log('Lesson successfully saved to Firestore!');
    return true;
  } catch (error) {
    console.error('Error saving lesson:', error);
    return false;
  }
};


export const getAllLessons = async () => {
  try {
    const data = await getDocs(collection(db, 'lessons'));
    const lessons = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return lessons;
  } catch (error) {
    console.error('Error getting lessons:', error);
  }
};


export const editLesson = async (lessonId, lessonData) => {
  try {
    const features = await Promise.all(
      lessonData.features.map(async (sublesson) => {
        if (sublesson.file) {
          let fileURL = '';
          if (sublesson.type === 'video') {
            fileURL = await uploadFile(sublesson.file, 'videos');
          } else if (sublesson.type === 'document') {
            fileURL = await uploadFile(sublesson.file, 'documents');
          }
          return { ...sublesson, link: fileURL };
        }
        return sublesson;
      })
    );

    await updateDoc(doc(db, 'lessons', lessonId), {
      name: lessonData.name,
      features,
      updatedAt: Date.now()
    });

    console.log('Lesson successfully updated in Firestore!');
    return true;
  } catch (error) {
    console.error('Error updating lesson:', error);
  }
};


export const deleteLesson = async (lessonId) => {
  try {
    await deleteDoc(doc(db, 'lessons', lessonId));
    console.log('Lesson successfully deleted!');
    return true;
  } catch (error) {
    console.error('Error deleting lesson:', error);
  }
};
