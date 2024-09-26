import { db } from './firebase'; 
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';



export const addNewTest = async (testData) => {
  try {
    const testRef = await addDoc(collection(db, "tests"), {
      title: testData.title,
      timeLimit: testData.timeLimit,
      questions: testData.questions,
    });
    return testRef.id; 
  } catch (error) {
    console.error("Error adding new test: ", error);
    throw error;
  }
};

export const updateTest = async (testId, updatedTestData) => {
  try {
    const testDocRef = doc(db, "tests", testId);
    await updateDoc(testDocRef, {
      title: updatedTestData.title,
      timeLimit: updatedTestData.timeLimit,
      questions: updatedTestData.questions,
    });
  } catch (error) {
    console.error("Error updating test: ", error);
    throw error;
  }
};


export const addQuestionToTest = async (testId, questionData) => {
  try {
    const testDocRef = doc(db, "tests", testId);
    const formattedQuestion = {
      question: questionData.question,
      questionType: questionData.questionType, 
      correctAnswer: questionData.correctAnswer || null,
      options: questionData.options || [], 
    };
    
    const testDoc = await updateDoc(testDocRef, {
      questions: [...questionData.questions, formattedQuestion], 
    });

    return testDoc;
  } catch (error) {
    console.error("Error adding question to test: ", error);
    throw error;
  }
};
