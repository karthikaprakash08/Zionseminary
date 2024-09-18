import React, { useEffect, useState } from 'react';
import './Register.css';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { db, storage, auth } from '../Admin/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import { createUserWithEmailAndPassword } from 'firebase/auth'; 


const options = {
  maritalStatus: [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' }
  ],
  gender: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ],
//  applyingFor: [
//    { value: 'certificateFamilyCounselling', label: 'Certificate in Family Counselling' },
//    { value: 'diplomaTheology', label: 'Diploma in Theology [Dip.Th]' },
//    { value: 'bThFastTrack', label: 'B.Th [Bachelor of Theology] - Fast track [2 years]' },
//    { value: 'bTh3Years', label: 'B.Th (3 Years)' },
//    { value: 'mDivFastTrack', label: 'M.Div [Master of Divinity] - Fast track [2 years]' },
//    { value: 'mDivRegular', label: 'M.Div [Master of Divinity] Regular 2 years' },
//    { value: 'mTh', label: 'M.Th [Master of Theology]' },
//    { value: 'phD', label: 'Ph.D [Doctor of Philosophy]' },
//    { value: 'dMin', label: 'D.Min [Doctorate of Ministry]' },
//    { value: 'dD', label: 'D.D [Doctor of Divinity]' },
//    { value: 'bThMDivIntegrated', label: 'B.Th & M.Div [Integrated Course]' },
//    { value: 'mDivMThIntegrated', label: 'M.Div & M.Th [Integrated Course]' },
//    { value: 'mDivDMinIntegrated', label: 'M.Div & D.Min [Integrated Course]' },
//    { value: 'mThPhDIntegrated', label: 'M.Th & Ph.D [Integrated Course]' }
//  ]
};

function Register() {
  const [applyingForOptions, setApplyingForOptions] = useState([]);
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const [courseOptions, setCourseOptions] = useState([]);



 // Fetch courses from Firestore 
 useEffect(() => {
  const fetchCourses = async () => {
    const coursesCollection = collection(db, 'courses');
    const coursesSnapshot = await getDocs(coursesCollection);
    const coursesList = coursesSnapshot.docs.map((doc) => ({
      value: doc.id, // Course ID as the value
      label: doc.data().name, // Course name as the label
    }));
    setCourseOptions(coursesList);
  };

  fetchCourses();
}, []);
  

  // Submit 
  const onSubmit = async (data) => {
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
        password: hashedPassword    
      });
  
      console.log('Data successfully saved to Firestore and files uploaded to Storage!');
      
      navigate('/admin');
    } catch (error) {
      console.error('Error saving data or uploading files:', error);
    }
  };

  return (
    <div className='register'>
      <form className="my-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 style={{ width: '10%', textAlign: 'center', marginBottom: "60px" }}>Registration form</h2>
        <div className="form-container">
          <div className="leftcolumn">
            <div className="form-group">
              <label>First Name *</label>
              <input type="text" placeholder="Enter First Name" {...register('firstName', { required: true })} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" placeholder="Enter Last Name" {...register('lastName')} />
            </div>
            <div className="form-group">
              <label>Mobile No *</label>
              <input type="tel" placeholder="Enter Mobile Number" {...register('mobileNo', { required: true })} />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" placeholder="Enter email address" {...register('email', { required: true })} />
            </div>
            <div className="form-group">
              <label>Marital Status *</label>
              <Select
                options={options.maritalStatus}
                onChange={(option) => setValue('maritalStatus', option.value)}
              />
            </div>
            <div className="form-group">
              <label>DOB *</label>
              <input type="date" {...register('dob', { required: true })} />
            </div>
            <div className="form-group">
              <label>Gender *</label>
              <Select
                options={options.gender}
                onChange={(option) => setValue('gender', option.value)}
              />
            </div>
            <div className="form-group">
              <label>Applying for *</label>
              <Select
                options={courseOptions} 
                onChange={(option) => setValue('applyingFor', option.value)}
              />
            </div>
            <div className="form-group">
              <label>Educational Qualification *</label>
              <input type="text" placeholder="Enter Educational Qualification" {...register('educationalQualification', { required: true })} />
            </div>
          </div>
          <div className="rightcolumn">
            <div className="form-group">
              <label>Theological Qualification *</label>
              <input type="text" placeholder="Enter Theological Qualification" {...register('theologicalQualification', { required: true })} />
            </div>
            <div className="form-group">
              <label>Present Address *</label>
              <input type="text" placeholder="Enter Present Address" {...register('presentAddress', { required: true })} />
            </div>
            <div className="form-group">
              <label>Ministry Experience *</label>
              <input type="text" placeholder="Enter Ministry Experience" {...register('ministryExperience', { required: true })} />
            </div>
            <div className="form-group">
              <label>Salvation Experience *</label>
              <input type="text" placeholder="Enter Salvation Experience" {...register('salvationExperience', { required: true })} />
            </div>

            <div className="form-group">
              <label>Signature *</label>
              <input type="file" {...register('signature', { required: true })} />
            </div>
            <div className="form-group">
              <label>Passport Size Photo *</label>
              <input type="file" {...register('passportSizePhoto', { required: true })} />
            </div>
            <div className="form-group">
              <label>Education Certificate *</label>
              <input type="file" {...register('educationCertificate', { required: true })} />
            </div>
            <div className="form-group">
              <label>User Name *</label>
              <input type="text" placeholder="Enter Username" {...register('username', { required: true })} />
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input type="password" placeholder="Enter Password" {...register('password', { required: true })} />
            </div>
            <div className="form-group">
              <input type="submit" value="Submit" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;