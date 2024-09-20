import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage, auth } from './firebase';
import bcrypt from 'bcryptjs';
import { createUserWithEmailAndPassword } from 'firebase/auth'; 


export const addUser = async (data) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);


      const signatureFile = data.signature[0];
      const signatureRef = ref(storage, `signatures/${signatureFile.name}`);
      await uploadBytes(signatureRef, signatureFile);
      const signatureURL = await getDownloadURL(signatureRef);
  
     
      const passportPhotoFile = data.passportSizePhoto[0];
      const passportPhotoRef = ref(storage, `photos/${passportPhotoFile.name}`);
      await uploadBytes(passportPhotoRef, passportPhotoFile);
      const passportPhotoURL = await getDownloadURL(passportPhotoRef);
  
      
      const educationCertFile = data.educationCertificate[0];
      const educationCertRef = ref(storage, `certificates/${educationCertFile.name}`);
      await uploadBytes(educationCertRef, educationCertFile);
      const educationCertURL = await getDownloadURL(educationCertRef);

     
  
      await addDoc(collection(db, 'users'), {
        userId: user.uid,
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNo: data.mobileNo,
        email: data.email,
        maritalStatus: data.maritalStatus,
        dob: data.dob,
        gender: data.gender,
        applyingFor: data.applyingFor,
        educationalQualification: data.educationalQualification,
        theologicalQualification: data.theologicalQualification,
        presentAddress: data.presentAddress,
        ministryExperience: data.ministryExperience,
        salvationExperience: data.salvationExperience,
        signatureURL: signatureURL,           
        passportPhotoURL: passportPhotoURL,   
        educationCertURL: educationCertURL ,
        username: data.username,
        password: hashedPassword,
        joinedDate: Date.now()   
      });

        console.log('Data successfully saved to Firestore and files uploaded to Storage!');
        return true
    } catch (error) {
        console.error('Error saving data or uploading files:', error);
    }
};

export const getAllUsers = async () => {
    try {
        const data = await getDocs(collection(db, 'users'))
        console.log(data?.docs)
        const users = data?.docs?.map((doc) => { return { id: doc.id, ...doc.data() } })
        return users
    } catch (error) {
        console.log(error)
    }
    return docRef
}

export const editUser = async (data) => {
    try {
        let educationCertURL = data?.educationCertURL || '';
        let signatureURL = data?.signatureURL || '';
        let passportPhotoURL = data?.passportPhotoURL || '';

        const signatureFile = data?.signature[0];
        if (signatureFile) {
            const signatureRef = ref(storage, `signatures/${signatureFile?.name}`);
            await uploadBytes(signatureRef, signatureFile);
            signatureURL = await getDownloadURL(signatureRef);
        }
        const passportPhotoFile = data.passportSizePhoto[0];
        if (passportPhotoFile) {
            const passportPhotoRef = ref(storage, `photos/${passportPhotoFile.name}`);
            await uploadBytes(passportPhotoRef, passportPhotoFile);
            passportPhotoURL = await getDownloadURL(passportPhotoRef);
        }
        const educationCertFile = data.educationCertificate[0];
        if (educationCertFile) {
            const educationCertRef = ref(storage, `certificates/${educationCertFile.name}`);
            await uploadBytes(educationCertRef, educationCertFile);
            educationCertURL = await getDownloadURL(educationCertRef);
        }
        await updateDoc(collection(db, 'users'), {
            firstName: data.firstName,
            lastName: data.lastName,
            mobileNo: data.mobileNo,
            email: data.email,
            maritalStatus: data.maritalStatus,
            dob: data.dob,
            gender: data.gender,
            applyingFor: data.applyingFor,
            educationalQualification: data.educationalQualification,
            theologicalQualification: data.theologicalQualification,
            presentAddress: data.presentAddress,
            ministryExperience: data.ministryExperience,
            salvationExperience: data.salvationExperience,
            signatureURL: signatureURL,
            passportPhotoURL: passportPhotoURL,
            educationCertURL: educationCertURL,
            username: data.username,
            password: hashedPassword  
        });

        console.log('Data successfully saved to Firestore and files uploaded to Storage!');
        return true
    } catch (error) {
        console.error('Error saving data or uploading files:', error);
    }
}

export const deleteUser = async (id) => {
    try {
        if (!id) {
            throw new Error('Invalid document ID');
        }
        await deleteDoc(doc(db, 'users', id));
        return true;
    } catch (error) {
        console.log('Error deleting user:', error);
    }
}