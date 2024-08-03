"use client";
import Footer from '@/components/Footer';
import BlogCard from '@/components/Home/blogCard';
import CardSlider from '@/components/Home/collectionCard';
import React, { useEffect } from 'react';
import { IoIosSearch } from "react-icons/io";

export interface BlogPost
{
  imageUrl: string;
  title: string;
  description: string;
}

const posts: BlogPost[] = [
  {
    imageUrl:
      "https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2022/12/seasonal-sales-cover-design.jpg?resize=1250,1120",
    title: "Free Colorful Clip Art to Promote Sales and Discounts",
    description:
      "Neon-colored and easy-to-use PNGs are here to assist you with any sale or promotion you’ve planned for 2023.",
  },
  {
    imageUrl:
      "https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2023/01/Brand-trust-design_featured-3.jpg?resize=1250,1120",
    title: "How to Build Brand Trust Through Good Design",
    description:
      "Reach your audience with five shortcuts for building brand trust through good design.",
  },
  {
    imageUrl:
      "https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2023/01/generative_ai_prompts_2.jpg?resize=1250,1120",
    title: "How to Write Better Generative AI Descriptions",
    description:
      "Get tips and tricks on how to adjust your text, so you can create imagery without limits.",
  },
];
interface Card
{
  title: string;
  image: string;
}

const cards: Card[] = [
  {
    title: "Fourth of July",
    image:
      "https://wallpapers.com/images/hd/natural-scenery-pictures-736-x-1308-2yckka60jpvm2q4e.jpg",
  },
  {
    title: "Summer Gardens",
    image:
      "https://i.pinimg.com/736x/79/fd/d1/79fdd17253b569a417e980a99aecd978.jpg",
  },
  {
    title: "Lucid Dreaming",
    image:
      "https://mrwallpaper.com/images/high/single-boy-in-yellow-hoodie-0lwl18k2bha6gwz6.jpg",
  },
  {
    title: "Teamwork",
    image:
      "https://i0.wp.com/thetitansfa.com/wp-content/uploads/2024/01/034www.emmahurleyphotography.com_-scaled.jpg?fit=1708%2C2560&ssl=1",
  },
];
const Page = () =>
{

  const audioClips = [
    { title: "Bouncing Along", artist: "Taizo Audio", duration: "2:20", bpm: 110, waveform: "polygon(0% 50%, 5% 61%, 10% 40%, 15% 65%, ...)" },
    { title: "Rise Through the Memo...", artist: "HWIYO", duration: "2:39", bpm: 72, waveform: "polygon(0% 50%, 5% 55%, 10% 45%, 15% 60%, ...)" },
    { title: "Artificial Intelligence Te...", artist: "Ricky Bombino", duration: "2:30", bpm: 150, waveform: "polygon(0% 50%, 5% 70%, 10% 30%, 15% 75%, ...)" },
    { title: "Baroque Beat", artist: "Jordan Childs", duration: "2:30", bpm: 80, waveform: "polygon(0% 50%, 5% 65%, 10% 35%, 15% 70%, ...)" },
    { title: "Hazy Sky", artist: "Konstantin Garbuzyuk", duration: "2:27", bpm: 110, waveform: "polygon(0% 50%, 5% 52%, 10% 48%, 15% 55%, ...)" },
    { title: "Moment Of Trust", artist: "Babel", duration: "2:34", bpm: 55, waveform: "polygon(0% 50%, 5% 51%, 10% 49%, 15% 52%, ...)" },
    { title: "Ensuring Good Times", artist: "Evan MacDonald", duration: "2:14", bpm: 120, waveform: "polygon(0% 50%, 5% 60%, 10% 40%, 15% 65%, ...)" },
  ];
  useEffect( () =>
  {
    console.log( audioClips );
  }, [] );

  return (
    <div className='main'>

      <div className="relative h-[600px] w-full overflow-hidden">
        <video
          className="absolute w-full h-[90%] object-cover "
          autoPlay
          loop
          muted
        >
          <source src={ '/images/Yellow_Final.webm' } type="video/mp4" />
        </video>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
          <h1 className="text-5xl font-bold px-16">
            Amp up your content with the best new music, now powered by PremiumBeat

          </h1>
          <p className="mt-4 text-xl mb-4">
            Make projects sound as good as they look with access to PremiumBeat's exclusive music library
          </p>
          <div className="w-full max-w-7xl bg-white p-4 rounded-lg shadow-lg">
            <div className="flex flex-wrap items-center gap-4">
              <select className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black">
                <option>Music</option>
              </select>
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Search for music"
                  className="w-full px-4 py-2 border border-gray-400 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
                Search by audio
              </button>
            </div>
          </div>
          <div className="flex flex-wrap justify-center mt-8">
            { [ 'Americana', 'Inspirational', 'Corporate', 'Emotional', 'Upbeat', 'Technology', 'Uplifting' ].map( ( category ) => (
              <button key={ category } className="bg-black bg-opacity-50 text-white rounded-full px-4 py-2 m-1 flex items-center bg-transparent backdrop-blur-sm hover:bg-opacity-30 transition duration-300">
                <IoIosSearch className="h-5 w-5 mr-2" />
                { category }
              </button>
            ) ) }
          </div>
        </div>

      </div>

      <div className="px-24">
        <div className="mb-8 ">
          <h1 className="text-5xl font-semibold">See what’s trending now</h1>
          <div className='flex justify-between'>

          <div className="flex flex-wrap justify-start mt-4">
            { [ 'News', 'Christmas', 'Nature', 'Fashion', 'Ambient', 'Documentary', 'Trap','Fun' ].map( ( category ) => (
              <button key={ category } className=" bg-opacity-50 text-black rounded-full px-4 m-1 flex items-center font-light bg-transparent backdrop-blur-sm hover:bg-opacity-30 transition duration-300 border border-black">
                <IoIosSearch className="h-5 w-5 mr-1" />
                { category }
              </button>
            ) ) }
          </div>
            <div className='flex flex-wrap px-5 gap-5 item-end'>
              <button className='border-black  border-b-3 px-3 font-bold'>The Latest</button>
              <button>
                Most popular
              </button>
            </div>
            </div>
       
        </div>


      <div className=" overflow-y-auto" >
        { audioClips.map( ( clip, index ) => (
          <div key={ index } className="bg-gray-800 rounded-lg p-4 mb-2 flex items-center">
            <button className="text-white mr-4">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="flex-grow">
              <h3 className="text-white font-semibold">{ clip.title }</h3>
              <p className="text-gray-400 text-sm">By { clip.artist }</p>
            </div>
            <div className="w-2/3 h-16 bg-gray-700 rounded mx-4">
              {/* <div className="h-full w-full bg-gray-500 opacity-50" style={ { clipPath: clip.waveform } }></div> */}
              
            </div>
            <div className="text-right text-gray-400">
              <p>{ clip.duration }</p>
              <p>{ clip.bpm } BPM</p>
            </div>
          </div>
        ) ) }
        </div>
        
      </div>

      <div className="my-8 flex justify-center ">
        <button className="flex items-center text-lg px-8 font-semibold py-2 border border-gray-700  rounded-full text-black bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-40 transition duration-300">
          See more
        </button>
      </div>

      <div className="p-10 px-24 bg-gray-200">
        <h1 className="text-3xl font-bold">
          Browse by genre and mood
        </h1>
        <div className="flex justify-between my-1">
          <div className="flex gap-3 mt-5 items-center">
            <img
              src="https://images.ctfassets.net/hrltx12pl8hq/21pSdbbGTESmLbPW0eY5Dm/54941e9127b6d071dc5c725eebbc713c/PB_thumbnail_Music_HP.jpg?fit=fill&w=120&h=120&fm=webp"
              alt="photo"
              className="object-cover rounded-md h-28 w-28"
            />
            <h1 className="font-semibold">PremiumBeat</h1>
          </div>
          <div className="flex gap-3 mt-5 items-center">
            <img
              src="https://images.ctfassets.net/hrltx12pl8hq/YfNwagJs5Ompmwp6RVlWU/645e5e4e3d817bc7b3feac650fe6dcdf/Shutterstock_Aerial_Footage.png?fit=fill&w=120&h=120&fm=webp"
              alt="photo"
              className="object-cover rounded-md h-28 w-28"
            />
            <h1 className="font-semibold">Epic</h1>
          </div>
          <div className="flex gap-3 mt-5 items-center">
            <img
              src="https://images.ctfassets.net/hrltx12pl8hq/37pGUfTPts5F547VIWRJVb/a1b5e67a81ad746af7635c71f4dd30e3/Pop_Music.jpg?fit=fill&w=120&h=120&fm=webp"
              alt="photo"
              className="object-cover rounded-md h-28 w-28"
            />
            <h1 className="font-semibold">Pop</h1>
          </div>
          <div className="flex gap-3 mt-5 items-center">
            <img
              src="https://images.ctfassets.net/hrltx12pl8hq/4HlVPZbyyoFqQAU6lD9coj/e17e08159732a9a83fce87b8507c923e/Funk_Music.jpg?fit=fill&w=120&h=120&fm=webp"
              alt="photo"
              className="object-cover rounded-md h-28 w-28"
            />
            <h1 className="font-semibold">Funk</h1>
          </div>
        </div>
        <div className="flex justify-between my-1">
          <div className="flex gap-3 mt-5 items-center">
            <img
              src="https://images.ctfassets.net/hrltx12pl8hq/7cMmrZnkRKwLN90I21chlH/d1b6bdf3ea6413ea98b2260a632a1d85/Jazz_Music.jpg?fit=fill&w=120&h=120&fm=webp"
              alt="photo"
              className="object-cover rounded-md h-28 w-28"
            />
            <h1 className="font-semibold">Jazz</h1>
          </div>
          <div className="flex gap-3 mt-5 items-center">
            <img
              src="https://images.ctfassets.net/hrltx12pl8hq/2lPVM5oa6oLw0UDKJrcQzk/c0a48027b7419910a21b1d37de388a17/Cinematic_Music.jpg?fit=fill&w=120&h=120&fm=webp"
              alt="photo"
              className="object-cover rounded-md h-28 w-28"
            />
            <h1 className="font-semibold">Cinematic</h1>
          </div>
          <div className="flex gap-3 mt-5 items-center">
            <img
              src="https://images.ctfassets.net/hrltx12pl8hq/3NTNrsyJU2dDvvhVYvyFHU/7819207afdca3e8a0517f51a78198255/Hip_Hop_Music.jpg?fit=fill&w=120&h=120&fm=webp"
              alt="photo"
              className="object-cover rounded-md h-28 w-28"
            />
            <h1 className="font-semibold">Hip Hop</h1>
          </div>
          <div className="flex gap-3 mt-5 items-center">
            <img
              src="https://images.ctfassets.net/hrltx12pl8hq/2WmFwfghFNdoxPWx5ibG93/00e2a9f8a01897b8a1289234ae6f4d6a/Trailer_Music.jpg?fit=fill&w=120&h=120&fm=webp"
              alt="photo"
              className="object-cover rounded-md h-28 w-28"
            />
            <h1 className="font-semibold">Trailer</h1>
          </div>
        </div>
      </div>

      <div className="px-24 py-12">
        <div className="flex justify-between items-center">
          <h2 className="text-5xl font-semibold mb-4 ">
            Explore handpicked collections
          </h2>
          <button className="flex items-center text-lg px-8 font-semibold py-2 border border-gray-700  rounded-full text-black bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-40 transition duration-300">
            See more collections
          </button>
        </div>
        <div className="container mx-auto gap-4 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 lg:mt-3">
          { cards.map( ( card, index ) => (
            <CardSlider key={ index } { ...card } />
          ) ) }
        </div>
      </div>


      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto py-10">
          <h2 className="text-3xl font-bold mb-6">
            Check out our blog for more articles about sound
          </h2>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-4 gap-4">
            { posts.map( ( data, index ) => (
              <BlogCard key={ index } { ...data } />
            ) ) }
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default Page;