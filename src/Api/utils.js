// Upload image and return image url

import axios from "axios"

export const imageUpload = async (imageData) => {
   const formData = new FormData();
   formData.append('image', imageData);

   const { data } = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, formData);

   const image_url = data.data.display_url;

   return image_url;
}

export const saveUser = async (currentUser) => {
   // save user info in db
   await axios.post(`${import.meta.env.VITE_API_URL}/users/${currentUser?.email}`, {
      name: currentUser?.displayName,
      image: currentUser?.photoURL,
      email: currentUser?.email,
   })
}