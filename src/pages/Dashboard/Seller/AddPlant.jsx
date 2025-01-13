import { Helmet } from 'react-helmet-async'
import AddPlantForm from '../../../components/Form/AddPlantForm'
import { imageUpload } from '../../../Api/utils';
import useAuth from '../../../hooks/useAuth';
import { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddPlant = () => {
  const { user } = useAuth();
  const [uploadImage, setUploadImage] = useState({ image: { name: 'Upload button' } });
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const navigete = useNavigate();

  console.log(uploadImage)

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // before fetch loading
    setLoading(true);
    const form = e.target;
    const name = form.name.value;
    const category = form.category.value;
    const description = form.description.value;
    const price = parseFloat(form.price.value);
    const quantity = parseInt(form.quantity.value);
    const image = form.image.files[0];
    const imageURL = await imageUpload(image);

    // seller Info
    const seller = {
      name: user?.displayName,
      email: user?.email,
      image: user?.photoURL,
    };

    // create plant object 
    const plantData = {
      name,
      category,
      description,
      price,
      quantity,
      image: imageURL,
      seller,
    }

    // save plant in db
    try {
      // post req
      await axiosSecure.post('/plants', plantData)
      toast.success("Plant added successfully!")
      navigete('/dashboard/my-inventory')
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }


  }


  return (
    <div>
      <Helmet>
        <title>Add Plant | Dashboard</title>
      </Helmet>

      {/* Form */}
      <AddPlantForm loading={loading} handleSubmit={handleSubmit} uploadImage={uploadImage} setUploadImage={setUploadImage} />
    </div>
  )
}

export default AddPlant
