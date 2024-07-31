// components/CategoryGrid.tsx
import React from "react";
export interface Category {
  title: string;
  imageUrl: string;
}

const categories: Category[] = [
  { title: "Abstract", 
    imageUrl: "https://images.ctfassets.net/hrltx12pl8hq/4l5bZtkt4f7nH7uyFQi4Vb/812e369976caabe99bb89814953885d6/5_abstract_painting.webp" 
},
  { title: "Animals | Wildlife", 
    imageUrl: "https://images.ctfassets.net/hrltx12pl8hq/6gsGYFitrk9QqdPcMjKYiM/e58384dbbddc2f74a8dc0e259c8eeccd/3_abstract_backgrounds.webp" 
},
  { title: "The arts", 
    imageUrl: "https://images.ctfassets.net/hrltx12pl8hq/1zbtYRlwha0ejHWl8SVY5A/1cc4ec2315bb1cc0265707318303d45c/1_abstract_art.webp" 
  },
  { title: "Backgrounds | Textures",
     imageUrl: "https://images.ctfassets.net/hrltx12pl8hq/6cOybdXpcRTB19N9G5pQ37/dbe37d306fdb3dda2d3d59e18cf28437/7_abstract_architecture.webp" 
  },
  { title: "Beauty | Fashion",
     imageUrl: "https://images.ctfassets.net/hrltx12pl8hq/7AY0lFMWFYM7pnMvQYU8dG/b535109e3fb2f0209cd0f66ee5e68e39/12_geometric_abstract.webp" 
    },
  { title: "Buildings | Landmarks", 
    imageUrl: "https://wallpapercave.com/wp/wp2665219.jpg" 
  },
  { title: "Business | Finance", 
    imageUrl: "https://th.bing.com/th/id/OIP.HFEyPXmLD5Sf_zMpRkMPKAHaEo?rs=1&pid=ImgDetMain"
   },
  { title: "Celebrities",
     imageUrl: "https://images.ctfassets.net/hrltx12pl8hq/1XwvE7PgPMss95unrtW7Ca/b4fea6f2e5d563495733b18cb158a75e/11_Royalty.webp" 
    },
  { title: "Editorial", 
    imageUrl: "https://images.ctfassets.net/hrltx12pl8hq/7jI7WkXc39siBLuzcHRSwC/5e131766e000075654bdfd7cb8c66db7/9_abstract_shapes.webp" 
  },
  { title: "Education", 
    imageUrl: "https://images.ctfassets.net/hrltx12pl8hq/42EmxNsqRKZdbrSS5tdpqd/9b076211db1689819a4e39cf5071e8e1/8_abstract_sketches.webp"
   },
  { title: "Food and drink", 
    imageUrl: "https://th.bing.com/th/id/OIP.BJOamtIJl_1eASDCsPF28QHaEo?rs=1&pid=ImgDetMain" 
  },
  { title: "Healthcare | Medical", 
    imageUrl: "https://images.ctfassets.net/hrltx12pl8hq/49ZEwUkFyZ4afTVjUzwrlF/ba0bd80a123a051b0af0c71fb4e2abd6/1_medicine.webp" },
];

const CategoryCard: React.FC = () => {
  return (
    
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <div
            key={index}
            className="group  overflow-hidden "
          >
            <img
              src={category.imageUrl}
              alt={category.title}
              className="w-full h-32 sm:h-40 md:h-44 object-cover rounded-md"
            />
            <div className="mt-1 ">
              <p className="text-black text-start font-semibold">{category.title}</p>
            </div>
          </div>
        ))}
        
      </div>
    
  );
};

export default CategoryCard;
