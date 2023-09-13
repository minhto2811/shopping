const admin = require('firebase-admin');

// Cấu hình kết nối với dự án Firebase
const serviceAccount = require('../config/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://shopping-6b085.appspot.com',
});

const bucket = admin.storage().bucket();

// Tải lên ảnh lên Firebase Storage
const uploadImage = async (localFilePath, fileName) => {
  try {
    await bucket.upload(localFilePath, {
      destination: fileName,
    });

    console.log('Tải lên thành công!');
    const file = bucket.file(fileName);
    const downloadURL = await file.getSignedUrl({
      action: 'read',
      expires: '10-06-2040'
    });
    return downloadURL[0];
  } catch (error) {
    console.error('Lỗi:', error);
    throw error;
  }
};


const deleteImage = async (imageUrl) => {
  try {
    // Lấy tên file từ link ảnh
    const fileName = extractFileNameFromImageUrl(imageUrl);

    // Xóa ảnh từ Firebase Storage
    const file = bucket.file(fileName);
    await file.delete();

    console.log('Xóa ảnh thành công!');
  } catch (error) {
    console.error('Lỗi:', error);
    throw error;
  }
};

// Hàm trích xuất tên file từ link ảnh trên Firebase Storage
const extractFileNameFromImageUrl = (imageUrl) => {
  const task1 = imageUrl.split('?');
  const task2 = task1[0].split('/');
  const url = task2[task2.length - 1];
  return url;
};



module.exports = {
  uploadImage,
  deleteImage
};