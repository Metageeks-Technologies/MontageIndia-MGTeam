import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import axios from 'axios';
import instance from '@/utils/axios';
import { notifyError } from '@/utils/toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Select, { MultiValue, ActionMeta } from 'react-select';

const categoriesOptions = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'books', label: 'Books' },
  { value: 'home', label: 'Home' },
  { value: 'sports', label: 'Sports' },
  { value: 'toys', label: 'Toys' },
  { value: 'beauty', label: 'Beauty' }
];

const Form1 = ({ onNext }: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaType, setMediaType] = useState(''); // Default to 'image'
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);

  const handleNext = async () => {
    const uuid = uuidv4();
    const slug = slugify(title, { lower: true });
    const data = { uuid, slug, title, description, mediaType, category: selectedCategories.map(c => c.value), tags };
    
    try {
      const response = await instance.post(`/product/`, data, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 201) {
        const data = response.data;
        console.log(data);
        onNext(data);
      }
    } catch (error) {
      notifyError("Please Fill all fields properly");
      console.error('Error sending data:', error);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tagInput.trim()) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };

  const isFormValid = () => {
    return title && description && mediaType && tags[0] && selectedCategories.length > 0;
  };

  const handleCategoryChange = (newValue: MultiValue<any>, actionMeta: ActionMeta<any>) => {
    setSelectedCategories(newValue as any[]);
  };

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex gap-3 flex-col'>
        <span className='text-xl font-semibold'>Title</span>
        <input
          placeholder="Enter Title"
          className='text-gray-700 outline-none py-3 p-2 bg-gray-100 rounded-lg'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <span className='text-xl font-semibold'>Description</span>
        <ReactQuill theme="snow" className='h-52 mt-4 mb-8' value={description} onChange={setDescription} />
      </div>
      <div>
        <span className='text-xl mb-3 font-semibold mr-4'>Category</span>
        <Select
          isMulti
          name="categories"
          options={categoriesOptions}
          className='basic-multi-select'
          classNamePrefix="select"
          value={selectedCategories}
          onChange={handleCategoryChange} // Use custom handler here
        />
      </div>
      <div>
        <span className='text-lg mb-3 font-semibold mr-4'>Media Type</span>
        <select
          className='text-gray-700 outline-none font-semibold py-3 select-none p-2 bg-gray-100 rounded-lg'
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
        >
          <option className='font-semibold hover:text-gray-800' value="" disabled>Select Media</option>
          <option className='font-semibold text-cyan-800' value="image">Image</option>
          <option className='font-semibold text-cyan-800' value="video">Video</option>
          <option className='font-semibold text-cyan-800' value="audio">Audio</option>
        </select>
      </div>
      <div>
      <span className='text-lg mb-3 font-semibold mr-4'>Tags</span>

        <input
          placeholder="Tags-labels"
          className='text-gray-700 outline-none py-3 p-2 bg-gray-100 rounded-lg'
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
        />
      </div>
      <div className='flex flex-wrap gap-2'>
        {tags.map((tag, index) => (
          <span key={index} className='bg-gray-200 font-medium text-black px-2 py-1 rounded'>
            {tag}
          </span>
        ))}
      </div>
      <button
        onClick={handleNext}
        className={`p-2 px-3 w-28 text-center items-center m-auto justify-center font-semibold flex text-white rounded-lg ${
          isFormValid() ? 'bg-lime-400 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'
        }`}
        disabled={!isFormValid()}
      >
        Next
      </button>
    </div>
  );
};

export default Form1;
