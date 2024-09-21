import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { v4 as uuidv4 } from 'uuid'; 

export const getAllDegrees = async () => {
    try {
        const data = await getDocs(collection(db, 'courses'));
        return data?.docs;
    } catch (error) {
        console.log(error);
    }
};

export const setNewDegree = async (newDegreeData) => {
    try {
        const id = uuidv4(); 
        const docRef = doc(db, 'courses', id);
        await setDoc(docRef, { ...newDegreeData, id }); // Add ID to the course
        return true;
    } catch (error) {
        console.log(error);
    }
};

export const updateDegree = async (updatedData, docId) => {
    try {
        const docRef = doc(db, 'courses', docId);
        await setDoc(docRef, updatedData);
        return true;
    } catch (error) {
        console.log(error);
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
