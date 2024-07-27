import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Variant {
  label: string;
  price: number;
  key: string;
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
}

const Form4: React.FC = ({}) => {
  const initialData: FormData = {
    id: "1",
    slug: "Cheese - Goat",
    title: "Appetizer - Smoked Salmon / Dill",
    description: "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n\nEtiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.",
    tags: ["calm", "celebration", "awesome"],
    variants: [
      {
        label: "Mr",
        price: 748.26,
        key: "https://robohash.org/quoquiquia.png?size=50x50&set=set1"
      },
      {
        label: "Mrs",
        price: 179.6,
        key: "https://robohash.org/similiquequia.png?size=50x50&set=set1"
      }
    ],
    status: "unavailable",
    mediaType: "video",
  };

  const [formData, setFormData] = useState<FormData>(initialData);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({
    title: false,
    slug: false,
    description: false,
    tags: false,
    variants: false,
    status: false,
    mediaType: false
  });
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string, field: string) => {
    if (typeof e === 'string') {
      // Handle cases where e is a string, e.g., for rich text editors
      console.log(e, field);
      setFormData({ ...formData, description: e });
    } else {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({ ...formData, tags: newTags });
  };

  const handleVariantChange = (index: number, key: keyof Variant, value: string | number) => {
    const newVariants = [...formData.variants];
    newVariants[index] = {
      ...newVariants[index],
      [key]: value
    } as Variant;
    setFormData({ ...formData, variants: newVariants });
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
  
  const handleSave = (field: string) => {
    switch (field) {
      case 'title':
        console.log('Title saved:', formData.title);
        break;
      case 'slug':
        console.log('Slug saved:', formData.slug);
        break;
      case 'description':
        console.log('Description saved:', formData.description);
        break;
      case 'tags':
        console.log('Tags saved:', formData.tags);
        break;
      case 'mediaType':
        console.log('Media Type saved:', formData.mediaType);
        break;
      default:
        console.log('Unknown field');
        break;
    }
    setEditMode(prev => ({ ...prev, [field]: false }));
  };
  
  const handleSaveVariant = (index: number) => {
    console.log('Saved Variant:', formData.variants[index]);
    handleSave('variants'); // Call handleSave for variants if needed
    setEditingVariantIndex(null); // Exit edit mode for the variant
    setEditMode(prev => ({ ...prev, variants: false }));
  };
  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Submit form data to API or handle it as needed
    console.log('Form submitted:', formData);
  };

  return (
    <div className="container flex flex-col p-8 pt-10 mx-auto sm:pl-64">
      <div className='text-3xl font-semibold w-full flex items-center justify-center'>Review Product</div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 m-auto w-full ">
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex flex-col w-full sm:w-1/2'>
            <span className='text-xl font-semibold'>Title</span>
             <div className='flex flex-row gap-3'>
                <input
                  type="text"
                  name="title"
                  className={`text-gray-700 w-full outline-none py-3 p-2 rounded-lg ${!editMode.title ? 'bg-gray-100' : 'bg-gray-200'}`}
                  value={formData.title}
                  disabled={!editMode.title}  // Correctly disable when not in edit mode
                  onChange={(e) => handleChange(e, 'title')}
                />
              <button type="button" className={`${!editMode.title ? 'hidden' : 'block'}`} onClick={() => { handleSave('title'); handleEditToggle('title'); }}>Save</button>
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
                  value={formData.slug}
                  onChange={(e) => handleChange(e, 'slug')}
                />
                <button type="button" className={`${!editMode.slug ? 'hidden' : 'block'}`} onClick={() => { handleSave('slug'); handleEditToggle('slug'); }}>Save</button>
                <button type="button" className={`${editMode.slug ? 'hidden' : 'block'}`} onClick={() => handleEditToggle('slug')}><FaRegEdit size={25} /></button>

            </div>
          </div>
        </div>

        <div>
          <span className='text-xl flex flex-row justify-between w-44 gap-4 font-semibold'>Description 
            <button type="button" className={` text-xl ${!editMode.description ? 'hidden' : 'block'}`} onClick={() => handleEditToggle('description')}>Save</button>
            <button type="button" className={`${editMode.description ? 'hidden' : 'block'}`} onClick={() => handleEditToggle('description')}><FaRegEdit /></button>
          </span>
          <ReactQuill
            theme="snow"
            className={`h-52 mt-4 mb-8`}
            value={formData.description}
            onChange={(value) => handleChange(value, 'description')}
            readOnly={!editMode.description}
          />
        </div>

        <div>
          <span className='text-xl font-semibold'>Tags:</span>
          {formData.tags.map((tag, index) => (
            <input
              key={index}
              type="text"
              value={tag}
              className={`text-gray-700 w-fit m-4 outline-none py-3 p-2 rounded-lg ${!editMode.tags ? 'bg-gray-100' : 'bg-gray-200'}`}
              onChange={(e) => handleTagChange(index, e.target.value)}
              readOnly={!editMode.tags}
            />
          ))}
          {editMode.tags ? (
            <button type="button" onClick={() => { handleSave('tags'); handleEditToggle('tags'); }}>Save</button>
          ) : (
            <button type="button" onClick={() => handleEditToggle('tags')}><FaRegEdit /></button>
          )}
        </div>

        <div>
          <span className='text-xl font-semibold'>Variants:</span>
          {formData.variants.map((variant, index) => (
          <div key={index}>
            <label className='font-semibold text-base'>Label:</label>
            <input
              type="text"
              value={variant.label}
              className='text-gray-700 outline-none m-4 py-3 p-2 bg-gray-100 rounded-lg'
              onChange={(e) => handleVariantChange(index, 'label', e.target.value)}
              disabled={editingVariantIndex !== index && editMode.variants}
            />
            <label className='font-semibold text-base'>Price:</label>
            <input
              type="number"
              value={variant.price}
              className='text-gray-700 outline-none m-4 py-3 p-2 bg-gray-100 rounded-lg'
              onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value))}
              disabled={editingVariantIndex !== index && editMode.variants}
            />
            {editMode.variants && editingVariantIndex === index ? (
              <>
                <button type="button" onClick={() => { handleSaveVariant(index); }}>Save</button>
                <button type="button" onClick={() => setEditingVariantIndex(null)}>Cancel</button>
              </>
            ) : (
              <button type="button" onClick={() => handleEditToggle('variants', index)}><FaRegEdit /></button>
            )}
          </div>
        ))}
        </div>

        <div>
          <label>Media Type:</label>
          {editMode.mediaType ? (
            <>
              <input
                type="text"
                name="mediaType"
                value={formData.mediaType}
                onChange={(e) => handleChange(e, 'mediaType')}
              />
              <button type="button" onClick={() => handleEditToggle('mediaType')}>Save</button>
            </>
          ) : (
            <>
              <p>{formData.mediaType}</p>
              <button type="button" onClick={() => handleEditToggle('mediaType')}><FaRegEdit /></button>
            </>
          )}
        </div>

        <div className='flex items-center justify-center'>
          <button type="submit" className='p-2 px-3 w-fit font-semibold flex text-white rounded-lg bg-lime-400'>Published</button>
        </div>
      </form>
    </div>
  );
};

export default Form4;
