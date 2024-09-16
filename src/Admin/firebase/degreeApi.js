import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const getAllDegrees = async () => {
    try {
        const data = await getDocs(collection(db, 'courses'))
        return data?.docs
    } catch (error) {
        console.log(error)
    }
    return docRef
}

export const setNewDegree = async (newDegreeData) => {
    try {
        const docRef = doc(collection(db, 'courses'));
        await setDoc(docRef, newDegreeData);
        return true
    } catch (error) {
        console.log(error)
    }
}

export const updateDegree = async (updatedData, docId) => {
    try {
        const docRef = doc(db, 'courses', docId);
        await setDoc(docRef, updatedData);
        return true
    } catch (error) {
        console.log(error)
    }
}

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
