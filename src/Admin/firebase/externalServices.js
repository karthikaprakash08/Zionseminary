import axios from 'axios';


const GOOGLE_DRIVE_ACCESS_TOKEN = 'google_drive_access_token';
const GOOGLE_DRIVE_FOLDER_ID = 'https://drive.google.com/drive/folders/1KF3TAUkmwPqISMEkL9Z3hbJSIVE-OiRD?usp=drive_link'; 

//VIMEO_CLIENT_ID=c70a003a069e9372eae2fe941bc286725160632c
//VIMEO_CLIENT_SECRET=6DBDo6PPZbWRenXHqxwnhqohxp/KfJBBokjtLM+QwLwLRgsFdQYbMzFRWJzez0e7D1Whg7n+lBuKzMb1PzkV/YNBW1O5Fpi6OvtX+MPVmPH07ySB5o06sGGux0lXE9BS";
const VIMEO_ACCESS_TOKEN= "f35cd45fcf73174cb0415288bd62cbca";


export const uploadToVimeo = async (file) => {
  try {
   
    const createVideoRes = await axios({
      method: 'POST',
      url: 'https://api.vimeo.com/me/videos',
      headers: {
        Authorization: `Bearer ${VIMEO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.vimeo.*+json;version=3.4',
      },
      data: {
        upload: {
          approach: 'tus', 
          size: file.size,
        },
      },
    });

    const uploadLink = createVideoRes.data.upload.upload_link;

   
    await axios({
      method: 'PATCH',
      url: uploadLink,
      headers: {
        'Tus-Resumable': '1.0.0',
        'Upload-Offset': 0,
        'Content-Type': 'application/offset+octet-stream',
      },
      data: file,
    });

    // Get the video link after upload
    const videoURL = createVideoRes.data.link;

    console.log('Video uploaded to Vimeo:', videoURL);
    return videoURL;
  } catch (error) {
    console.error('Error uploading video to Vimeo:', error);
    throw new Error('Vimeo upload failed');
  }
};


export const uploadToDrive = async (file) => {
  try {
    const metadata = {
      name: file.name,
      parents: [GOOGLE_DRIVE_FOLDER_ID], 
    };

    const formData = new FormData();
    formData.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    formData.append('file', file);

    const uploadRes = await axios({
      method: 'POST',
      url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      headers: {
        Authorization: `Bearer ${GOOGLE_DRIVE_ACCESS_TOKEN}`,
        'Content-Type': 'multipart/related',
      },
      data: formData,
    });

    const fileId = uploadRes.data.id;

   
    await axios({
      method: 'POST',
      url: `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
      headers: {
        Authorization: `Bearer ${GOOGLE_DRIVE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const fileURL = `https://drive.google.com/uc?id=${fileId}&export=download`;

    console.log('Document uploaded to Google Drive:', fileURL);
    return fileURL;
  } catch (error) {
    console.error('Error uploading document to Google Drive:', error);
    throw new Error('Google Drive upload failed');
  }
};