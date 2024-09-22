import axios from 'axios';

export const uploadToVimeo = async (file) => {
  console.log("Uploading to Vimeo...");
  try {
    const createVideoRes = await axios({
      method: 'POST',
      url: 'https://api.vimeo.com/me/videos',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_VIMEO_ACCESS_TOKEN}`,
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
  console.log("Uploading to Google Drive...");
  
  try {
    const metadata = {
      name: file.name,
      parents: [import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID],
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', file);

    const accessToken = import.meta.env.VITE_GOOGLE_DRIVE_ACCESS_TOKEN; 

    // Uploading file to Google Drive
    const uploadRes = await axios({
      method: 'POST',
      url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/related',
      },
      data: formData,
    });

    const fileId = uploadRes.data.id;

    // Set file permissions to allow public access
    await axios({
      method: 'POST',
      url: `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const fileURL = `https://drive.google.com/uc?id=${fileId}&export=download`;
    console.log('File uploaded to Google Drive:', fileURL);
    return fileURL;

  } catch (error) {
    console.error('Error uploading document to Google Drive:', error);
    throw new Error('Google Drive upload failed');
  }
};
