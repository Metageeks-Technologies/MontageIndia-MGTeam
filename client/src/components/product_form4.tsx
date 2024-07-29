import instance from '@/utils/axios';
import { notifySuccess } from '@/utils/toast';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import { MdOutlineSave } from 'react-icons/md';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Variant {
  label: string;
  price: number;
  key: string;
  _id:string
}

interface FormData {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  variants: Variant[];
  status: string;
  mediaType: string;
  category:string[];
}

const Form4 = ({ formData }: any) => {
  const router=useRouter()
  const initialData =formData||{}
  console.log("initialData",initialData)
  const [data, setFormData] = useState<FormData>(initialData);
  const [newTag, setNewTag] = useState<string>(''); // State for the new tag input
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({
    title: false,
    slug: false,
    description: false,
    tags: false,
    variants: false,
    status: false,
    mediaType: false,
    category:false
  });
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string, field: string) => {
    if (typeof e === 'string') {
      // Handle cases where e is a string, e.g., for rich text editors
      setFormData({ ...data, description: e });
    } else {
      const { name, value } = e.target;
      setFormData({
        ...data,
        [name]: value
      });
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...data.tags];
    newTags[index] = value;
    setFormData({ ...data, tags: newTags });
  };

  const handleVariantChange = (index: number, key: keyof Variant, value: string | number) => {
    const newVariants = [...data.variants];
    newVariants[index] = {
      ...newVariants[index],
      [key]: value
    } as Variant;
    setFormData({ ...data, variants: newVariants });
  };

  const handleEditToggle = (field: string, index?: number) => {
    if (index !== undefined) {
      // Toggle edit mode for specific variant
      if (field === 'variants') {
        setEditingVariantIndex(index);
        setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
      }
    } else {
      setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
    }
  };

  const handleSave = async (field: string) => {
    try {
      let updatedField = {};
      switch (field) {
        case 'title':
          updatedField = { title: data.title };
          break;
        case 'slug':
          updatedField = { slug: data.slug };
          break;
          case 'category':
          updatedField = { slug: data.category };
          break;
        case 'description':
          updatedField = { description: data.description };
          break;
        case 'tags':
          updatedField = { tags: data.tags };
          break;
        case 'variants':
          updatedField = { variants: data.variants };
          break;
        default:
          throw new Error('Unknown field');
      }

      const response = await instance.patch(`/product/${initialData.uuid}`, updatedField);
  
      console.log('Save result:', response.data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  
    setEditMode(prev => ({ ...prev, [field]: false }));
  };
  const handleSaveVariant = async (index: number) => {
    try {
      const variant = data.variants[index];
    
      // Prepare the data to be sent
      const sendData = {
        uuid: initialData.uuid,
        price: variant.price,
        label: variant.label
      };
      // Make the API call with the data
      const response = await instance.patch(`/product/variant/${variant._id}`, sendData);
  
      // Log the response for debugging
      console.log('Saving variant data:', response.data);
    } catch (error) {
      console.error('Error saving variant:', error);
    }
    setEditingVariantIndex(null); // Exit edit mode for the variant
    setEditMode(prev => ({ ...prev, variants: false }));
  };
  const handleAddTag = () => {
    if (newTag.trim() !== '') {
      setFormData({ ...data, tags: [...data.tags, newTag.trim()] });
      setNewTag(''); // Clear the input field after adding the tag
    }
  };

  const handleDeleteTag = (index: number) => {
    const newTags = data.tags.filter((_, i) => i !== index);
    setFormData({ ...data, tags: newTags });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
     const updatedField = { status: "published" };
      const response = await instance.patch(`/product/${initialData.uuid}`, updatedField);
      
      if(response.status===201){
        notifySuccess("Product published successfully")
        router.push('/admin/user/userList')
      }
        
      // const result = await response.json();
      // console.log('Form submitted:', result);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="flex flex-col  ">
      <div className='text-3xl font-semibold w-full flex items-center justify-center'>Review Product</div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 m-auto w-full">
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex flex-col w-full sm:w-1/2'>
            <span className='text-xl font-semibold'>Title</span>
            <div className='flex flex-row gap-3'>
              <input
                type="text"
                name="title"
                className={`text-gray-700 w-full outline-none py-3 p-2 rounded-lg ${!editMode.title ? 'bg-gray-100' : 'bg-gray-200'}`}
                value={data.title}
                disabled={!editMode.title}  // Correctly disable when not in edit mode
                onChange={(e) => handleChange(e, 'title')}
              />
              <button type="button" className={`${!editMode.title ? 'hidden' : 'block'}`} onClick={() => { handleSave('title'); handleEditToggle('title'); }}><MdOutlineSave size={20} /></button>
              <button type="button" className={`${editMode.title ? 'hidden' : 'block'}`} onClick={() => handleEditToggle('title')}><FaRegEdit size={25} /></button>
            </div>
          </div>

          <div className='flex flex-col w-full sm:w-1/2'>
            <span className='text-xl font-semibold'>Slug</span>
            <div className='flex flex-row gap-3'>
              <input
                type="text"
                name="slug"
                className={`text-gray-700 w-full outline-none py-3 p-2 rounded-lg ${!editMode.slug ? 'bg-gray-100' : 'bg-gray-200'}`}
                value={data.slug}
                onChange={(e) => handleChange(e, 'slug')}
                disabled={!editMode.slug}
              />
              <button type="button" className={`${!editMode.slug ? 'hidden' : 'block'}`} onClick={() => { handleSave('slug'); handleEditToggle('slug'); }}><MdOutlineSave size={20} /></button>
              <button type="button" className={`${editMode.slug ? 'hidden' : 'block'}`} onClick={() => handleEditToggle('slug')}><FaRegEdit size={25} /></button>
            </div>
          </div>
        </div>

        <div>
          <span className='text-xl flex flex-row justify-between w-44 gap-4 font-semibold'>Description
            <button type="button" className={`text-xl ${!editMode.description ? 'hidden' : 'block'}`} onClick={() =>{handleSave('description'); handleEditToggle('description')}}><MdOutlineSave size={20} /></button>
            <button type="button" className={`${editMode.description ? 'hidden' : 'block'}`} onClick={() => handleEditToggle('description')}><FaRegEdit /></button>
          </span>
          <ReactQuill
            theme="snow"
            className={`h-52 mt-4 mb-8`}
            value={data.description}
            onChange={(value) => handleChange(value, 'description')}
            readOnly={!editMode.description}
          />
        </div>

        <div>
          <span className='text-xl font-semibold'>Tags <span>
            {editMode.tags && (
                <button type="button" onClick={() => handleSave('tags')}><MdOutlineSave size={20} /></button>
              )} <button
            type="button"
            className={`text-xl ${!editMode.tags ? 'block' : 'hidden'}`}
            onClick={() => handleEditToggle('tags')}
          >
            <FaRegEdit size={25} />
          </button></span></span>

          <div className='flex flex-col sm:flex-wrap gap-3'>
            {data.tags.map((tag, index) => (
              <div key={index} className='flex items-center flex-col sm:flex-row sm:flex-wrap gap-4'>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                  disabled={!editMode.tags}
                  className={`text-gray-700 outline-none p-2 rounded-lg ${!editMode.tags ? 'bg-gray-100' : 'bg-gray-200'}`}
                />
                {editMode.tags && (
                  <button
                    type="button"
                    onClick={() => handleDeleteTag(index)}
                    className='bg-red-500 text-white p-2 rounded-lg'
                  >
                    <FaTrashAlt />
                  </button>
                )}
              </div>
            ))}
            {editMode.tags && (
              <div className='flex gap-2 mt-2'>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className='text-gray-700 outline-none p-2 rounded-lg bg-gray-200'
                  placeholder="Add new tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className='bg-blue-500 text-white py-2 px-4 rounded-lg'
                >
                  Add Tag
                </button>
              </div>
            )}
          </div>
          {/* Edit button for tags */}
          <div className='flex flex-col'>
          <span className='text-xl font-semibold'>Category</span>
          <div className='flex flex-col'>
            {data.category.map((cat, index) => (
              <span key={index} className='p-2'>{cat}</span>
            ))}
          </div>
        </div>
        </div>

        <span className='text-xl font-semibold'>Variants </span>

        <div className='flex flex-col '>
          {data.variants.map((variant, index) => (<>
              <span className='text-lg  items-center w-32 justify-between flex  font-semibold'>Version {index+1}
                {editingVariantIndex === index ? (
                <button type="button" onClick={() => handleSaveVariant(index)}><MdOutlineSave size={20} /></button>
              ) : (
                <button type="button" onClick={() => handleEditToggle('variants', index)}><FaRegEdit size={22} /></button>
             )}</span>

            
            <div key={index} className='flex flex-col sm:flex-row m-2 gap-8'>
              <span className='flex flex-row items-center justify-between w-20'>Label :-   
              </span>
              <input
                type="text"
                className={`text-gray-700 w-fit outline-none py-3 p-2 rounded-lg ${editingVariantIndex === index ? 'bg-gray-200' : 'bg-gray-100'}`}
                value={variant.label}
                onChange={(e) => handleVariantChange(index, 'label', e.target.value)}
                readOnly={editingVariantIndex !== index}
              />
              <span className='flex flex-row items-center justify-between w-20'>Price:
              </span>
              <input
                type="text"
                className={`text-gray-700 w-fit outline-none py-3 p-2 rounded-lg ${editingVariantIndex === index ? 'bg-gray-200' : 'bg-gray-100'}`}
                value={variant.price}
                onChange={(e) => handleVariantChange(index, 'price', Number(e.target.value))}
                readOnly={editingVariantIndex !== index}
              />
            </div>
            </>  ))}
        </div>

        <div>
          <span className='text-xl flex flex-row justify-between w-44 gap-4 font-semibold'>Media Type
          </span>
          <input
            type="text"
            className={`text-gray-700 w-full outline-none py-3 p-2 rounded-lg bg-gray-200}`}
            value={data.mediaType}
            onChange={(e) => handleChange(e, 'mediaType')}
            disabled={!editMode.mediaType}
          />
        </div>

        <div className="flex flex-row justify-between gap-4">
          <button type="submit" className="bg-lime-500 text-white p-2 rounded">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Form4;
