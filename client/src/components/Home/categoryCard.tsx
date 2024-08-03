// components/CategoryGrid.tsx
import React from "react";
export interface Category {
  title: string;
  imageUrl: string;
}

const CategoryCard = (data: Category) => {
  return (
    <div className="group  overflow-hidden ">
      <img
        src={data.imageUrl}
        alt={data.title}
        className="w-full h-44 sm:h-40 md:h-44 object-cover rounded-md"
      />
      <div className="mt-1 ">
        <p className="text-black text-start font-semibold">{data.title}</p>
      </div>
    </div>
  );
};

export default CategoryCard;
