// components/BlogSection.tsx
import React from "react";

export interface BlogPost {
  imageUrl: string;
}

const posts: BlogPost[] = [
  {
    imageUrl:
      "https://images.ctfassets.net/hrltx12pl8hq/6nJaRnp2pkQcIq5qDlnTlL/37e62b10f34ccd1669629045c14312ff/rgbcover.webp",
  },
  {
    imageUrl:
      "https://images.ctfassets.net/hrltx12pl8hq/1PMfxyPFpntWyrKVeScdDD/e59aac83bb3e5b5737d1a60cd08dd8e5/stock_footage_glossary_cover.webp",
  },
  {
    imageUrl:
      "https://images.ctfassets.net/hrltx12pl8hq/26vH4jX8NikGFE4EgOeIjB/2761c52ebba2de165a2e4dc3507acdeb/5-ProjectsFeature__1_.webp",
  },
];

const Blog: React.FC = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row rounded-lg overflow-hidden">
        <div className="md:w-1/2">
          <img
            src="https://images.ctfassets.net/hrltx12pl8hq/2Jc71KPBW4689oGCgSLa4P/fc15b7e5c6f5eb886f2a9846c683f200/archival_footage_tips_cover.webp"
            className="w-full h-[23rem] object-cover"
          />
        </div>
        <div className="p-4 md:w-1/2 flex flex-col justify-center">
          <h3 className="font-semibold mb-2">
            How to Incorporate Negative Space in Design and Photography
          </h3>
          <p className="text-gray-700 text-sm">
            Learn why negative space works in design and photography, and pick
            up a few tips for using it in your own creative content.
          </p>
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
              alt="Photo"
              className="w-full h-60  bg-black bg-opacity-0 hover:bg-opacity-50 object-cover "
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Blog;
