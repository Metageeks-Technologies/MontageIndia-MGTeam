// components/CategoryGrid.tsx
import React from "react";
export interface Category {
  title: string;
  imageUrl: string;
}

const categories: Category[] = [
  { title: "Abstract", 
    imageUrl: "https://images.ctfassets.net/hrltx12pl8hq/29slzVZfucEQwKoKc8QcEA/ed7ceb74525e822dd3eb888f570f0d52/adventure" 
},
  { title: "Animals | Wildlife", 
    imageUrl: "https://images.ctfassets.net/hrltx12pl8hq/79UGbvGqfj9bQVi66yr9VT/1cae2227203e2c3c7ff3b21befe96a9f/Abstract" 
},
  { title: "The arts", 
    imageUrl: "https://images.ctfassets.net/hrltx12pl8hq/61MiY3Wj3U6KSSKi2muig2/7e4c77aa598ca4ac93aab5858c3e7627/Autumn" 
  },
  { title: "Backgrounds | Textures",
     imageUrl: "https://images.ctfassets.net/hrltx12pl8hq/yZsuq5HdBuUmYekaKiuUQ/d73a0e6f5fe939be07a19f22a92f2e09/Wild-Life" 
  },
  { title: "Beauty | Fashion",
     imageUrl: "https://images.ctfassets.net/hrltx12pl8hq/77nM3vIkxOy0MSIeESAsi6/ef81eb2041ae0b3a240a8241c732b0eb/3D_Footage" 
    },
    { title: "Beauty | Fashion",
        imageUrl: "https://images.ctfassets.net/hrltx12pl8hq/2R1nDTrRheK6ae2IWAgGwW/e879fceb983dd133702ecdbfb560d4cd/Aerial" 
       },
];

const Category: React.FC = () => {
  return (
    
      <div className="grid grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="group  overflow-hidden "
          >
            <img
              src={category.imageUrl}
              alt={category.title}
              className="w-full h-60  object-cover rounded-md"
            />
          </div>
        ))}
        
      </div>
    
  );
};

export default Category;
