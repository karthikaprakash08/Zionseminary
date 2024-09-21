import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { storage } from "./firebase"; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid'; 

const uploadFile = async (file) => {
    const storageRef = ref(storage, `thumbnails/${file.name}`);
    await uploadBytes(storageRef, file);
    const fileURL = await getDownloadURL(storageRef);
    return fileURL;  
};

export const getAllDegrees = async () => {
    try {
        const data = await getDocs(collection(db, 'courses'));
        return data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching degrees:', error);
    }
};


export const setNewDegree = async (newDegreeData) => {
    try {
        const id = uuidv4(); 
        const docRef = doc(db, 'courses', id);

        // Handle thumbnail 
        if (newDegreeData.thumbnail) {
            const thumbnailURL = await uploadFile(newDegreeData.thumbnail);
            newDegreeData.thumbnail = thumbnailURL; 
        }

        await setDoc(docRef, { ...newDegreeData, id }); 
    } catch (error) {
        console.error('Error setting new degree:', error);
    }
};


export const updateDegree = async (updatedData, docId) => {
    try {
        const docRef = doc(db, 'courses', docId);
        await updateDoc(docRef, updatedData); // Use updateDoc to keep existing fields
        return true;
    } catch (error) {
        console.error('Error updating degree:', error);
    }
};


export const deleteDegree = async (docId) => {
    try {
        if (!docId) {
            throw new Error('Invalid document ID');
        }
        await deleteDoc(doc(db, 'courses', docId));
        return true;
    } catch (error) {
        console.error('Error deleting document:', error);
        return false; 
    }
};
