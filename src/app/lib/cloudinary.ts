// import {v2 as cloudinary} from 'cloudinary'
// import { IncomingForm } from 'formidable';

// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret:process.env.CLOUDINARY_API_SECRET
// });

// export default async function uploadonCloudinary(path : string){
//     try {

//         if (!path) return;
//         const data = await new Promise((resolve, reject) => {
//         const form = new IncomingForm();
//         form.uploadDir = '/tmp'; // temp folder
//         form.keepExtensions = true;
            
//         form.parse( (err, fields, files) => {
//           if (err) reject(err);
//           else resolve({ fields, files });
//         });
//       });

//         const response = await cloudinary.uploader.upload(path , { resource_type : 'auto' , folder: 'resumes' })

//         return response

//     } catch (error) {
//         console.error("Error during uploading file in cloudinary : ",error)
//     }
// }