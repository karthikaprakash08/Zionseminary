import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { uploadToVimeo, uploadToDrive } from './externalServices'; 
import { v4 as uuidv4 } from 'uuid'; 

export const uploadFile = async (file, type) => {
  let fileURL = '';

  try {
    if (type === 'video') {
      fileURL = await uploadToVimeo(file);  // Upload to Vimeo for videos
    } else if (type === 'document') {
      fileURL = await uploadToDrive(file);  // Upload to Google Drive for documents
    }
    return fileURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('File upload failed');
  }
};

export const addLesson = async (lessonData) => {
  try {
    const lessonId = uuidv4();
    const features = await Promise.all(
      lessonData.features.map(async (sublesson) => {
        let fileURL = '';

        if (sublesson.file) {
          fileURL = await uploadFile(sublesson.file, sublesson.type); 
        }

        return { ...sublesson, link: fileURL }; 
      })
    );

    await addDoc(collection(db, 'lessons'), {
      id: lessonId, 
      name: lessonData.name,
      features, 
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
        let fileURL = '';

        if (sublesson.file) {
          fileURL = await uploadFile(sublesson.file, sublesson.type);  
        }

        return { ...sublesson, link: fileURL };
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
