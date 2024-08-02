import React from "react";

type ImageData = {
  title: string;
  imageUrl: string;
  author: string;
  authorUrl: string;
  downloadUrl: string;
};

const WeeklyCard = (data: ImageData) => {
  return (
    <div className="overflow-hidden">
      <img
        src={data.imageUrl}
        alt={data.title}
        className="lg:w-80 lg:h-44  md:w-80 md:h-44 w-40 h-24 rounded object-cover"
      />
      <div className="mt-2">
        <p className="font-semibold">{data.title}</p>
        <p className="text-sm text-gray-600">
          By{" "}
          <a href={data.authorUrl} className="text-blue-600">
            {data.author}
          </a>
        </p>
        <a href={data.downloadUrl} className="text-blue-600 mt-2 block">
          Download
        </a>
      </div>
    </div>
  );
};

export default WeeklyCard;
