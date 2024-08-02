// components/BlogSection.tsx
import React from "react";

export interface BlogPost {
  imageUrl: string;
  title: string;
  description: string;
}

const Blog = (data: BlogPost) => {
  return (
    <>
      <div className="group relative overflow-hidden rounded-md  ">
        <img
          src={data.imageUrl}
          alt="Photo"
          className="w-full h-60  bg-black bg-opacity-0 hover:bg-opacity-50 object-cover "
        />
         <div className=" flex flex-col mt-1">
          <h3 className=" font-semibold">{data.title}</h3>
          <p className="text-gray-700 text-sm">{data.description}</p>
        </div>
      </div>
    </>
  );
};

export default Blog;
