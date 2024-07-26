import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import axios from 'axios';

const Form1 = ({ onNext }: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setcategory] = useState('');
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
          className='text-black p-1'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <input
          placeholder="Description"
          className='text-black p-1'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <input
          placeholder="Category"
          className='text-black p-1'
          value={category}
          onChange={(e) => setcategory(e.target.value)}
        />
      </div>
      <div>
        <select
          className='text-black p-1'
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
        </select>
      </div>
      <div>
        <input
          placeholder="Tags"
          className='text-black p-1'
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
