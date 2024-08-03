// components/CategoryGrid.tsx
import React from "react";
export interface category {
  title: string;
  imageUrl: string;
}

const Category = (data: category) => {
  return (
    <div className="group  overflow-hidden ">
      <img
        src={data.imageUrl}
        alt={data.title}
        className="w-full h-60  object-cover rounded-md"
      />
       <div className="mt-1 ">
        <p className="text-black text-start font-semibold">{data.title}</p>
      </div>
    </div>
  );
};

export default Category;
