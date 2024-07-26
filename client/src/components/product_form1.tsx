import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import axios from 'axios';

const Form1 = ({ onNext }: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(''); 
  const [mediaType, setMediaType] = useState('image'); // Default to 'image'
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleNext = async() => {
    const uuid = uuidv4();
    const slug = slugify(title, { lower: true });
    // console.log({ uuid, slug, title, description,category, mediaType, tags });
    const data = { uuid, slug, title, description, mediaType,category, tags };
    
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/product/`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        const data=response.data;
        console.log(data)
        onNext(data);
      }
    } catch (error) {
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

  return (
    <div className='flex flex-col items-center w-full gap-5 h-full justify-center mt-16'>
      <h1>Product</h1>
      <div>
        <input
          placeholder="Title"
          className='text-black p-2 bg-gray-500 rounded-lg '
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className=''>
        <textarea 
          placeholder="Description"
          className='text-black p-2 w-full '
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <select
          className='text-gray-400 font-semibold p-2 bg-gray-500 rounded-lg '
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option className='font-semibold text-cyan-800' value="" disabled>Select Category</option>
          <option className='font-semibold text-cyan-800' value="electronics">Electronics</option>
          <option className='font-semibold text-cyan-800' value="fashion">Fashion</option>
          <option className='font-semibold text-cyan-800' value="books">Books</option>
          <option className='font-semibold text-cyan-800' value="home">Home</option>
          <option className='font-semibold text-cyan-800' value="sports">Sports</option>
          <option className='font-semibold text-cyan-800' value="toys">Toys</option>
          <option className='font-semibold text-cyan-800' value="beauty">Beauty</option>
        </select>
      </div>
      <div>
        <select
          className='text-gray-400 font-semibold p-2 bg-gray-500 rounded-lg '
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
        >
          <option className='font-semibold text-cyan-800'  value="image">Image</option>
          <option className='font-semibold text-cyan-800' value="video">Video</option>
          <option className='font-semibold text-cyan-800' value="audio">Audio</option>
        </select>
      </div>
      <div>
        <input
          placeholder="Tags"
          className='text-black p-2 bg-gray-500 rounded-lg '
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
        />
      </div>
      <div className='flex flex-wrap gap-2'>
        {tags.map((tag, index) => (
          <span key={index} className='bg-gray-200 text-black px-2 py-1 rounded'>
            {tag}
          </span>
        ))}
      </div>
      <button onClick={handleNext} className='p-2 px-3 bg-green-500 rounded-lg'>
        Next
      </button>
    </div>
  );
};

export default Form1;
