// components/BlogSection.tsx
import React from "react";

export interface BlogPost {
  imageUrl: string;
  title: string;
  description: string;
}


const posts: BlogPost[] = [
  {
    imageUrl: "https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2022/12/seasonal-sales-cover-design.jpg?resize=1250,1120",
    title: "Free Colorful Clip Art to Promote Sales and Discounts",
    description:
      "Neon-colored and easy-to-use PNGs are here to assist you with any sale or promotion you’ve planned for 2023.",
  },
  {
    imageUrl: "https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2023/01/Brand-trust-design_featured-3.jpg?resize=1250,1120",
    title: "How to Build Brand Trust Through Good Design",
    description:
      "Reach your audience with five shortcuts for building brand trust through good design.",
  },
  {
    imageUrl: "https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2023/01/generative_ai_prompts_2.jpg?resize=1250,1120",
    title: "How to Write Better Generative AI Descriptions",
    description:
      "Get tips and tricks on how to adjust your text, so you can create imagery without limits.",
  },
];

const BlogCard: React.FC = () => {
  return (
    <>
    <div className="flex flex-col md:flex-row rounded-lg overflow-hidden">
      <div className="md:w-1/2">
        <img
          src="https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2023/01/negative_space_cover.jpg?resize=1250,1120"
         
          className="w-full h-[23rem] object-cover"
        />
      </div>
      <div className="p-4 md:w-1/2 flex flex-col justify-center">
        <h3 className="font-semibold mb-2">How to Incorporate Negative Space in Design and Photography</h3>
        <p className="text-gray-700 text-sm">Learn why negative space works in design and photography, and pick up a few tips for using it in your own creative content.</p>
      </div>
    </div>
    <div className="grid grid-cols-3 mt-4 gap-4">
      {posts.map((post, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-md  "
        >
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-60  bg-black bg-opacity-0 hover:bg-opacity-50 object-cover "
          />
          <div className=" flex flex-col mt-1">
            <h3 className=" font-semibold">{post.title}</h3>
            <p className="text-gray-700 text-sm">{post.description}</p>
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default BlogCard;
