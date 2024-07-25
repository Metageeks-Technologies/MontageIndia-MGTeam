import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

const Form1 = ({ onNext }: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleNext = () => {
    const uuid = uuidv4();
    const slug = slugify(title, { lower: true });
    console.log({ uuid, slug, title, description, tags });
    onNext();
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
          placeholder="Tags "
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
