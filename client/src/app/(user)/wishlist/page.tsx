"use client";
import { useEffect, useState } from "react";
import instance from "@/utils/axios";
import { IoIosPause } from "react-icons/io";
import { IoIosPlay } from "react-icons/io";

interface Product {
  _id: string;
  uuid: string;
  title: string;
  description: string;
  mediaType: string;
  publicKey: string;
  thumbnailKey: string;
  status: string;
}

interface WishlistData {
  products: Product[];
  pagination: {
    totalProducts: number;
    currentPage: number;
    totalPages: number;
  };
}

const Collection: React.FC = () => {
  const [assetTypeOpen, setAssetTypeOpen] = useState(false);
  const [wishlistData, setWishlistData] = useState<WishlistData | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});

  const updateProgress = (audioElement: HTMLAudioElement, productId: string) => {
    const progressValue = (audioElement.currentTime / audioElement.duration) * 100;
    setProgress((prevProgress) => ({ ...prevProgress, [productId]: progressValue }));
  };

  const togglePlay = (productId: string, audioElement: HTMLAudioElement | null) => {
    if (audioElement) {
      if (playingId === productId) {
        audioElement.pause();
        setPlayingId(null);
      } else {
        if (playingId) {
          const prevAudioElement = document.getElementById(
            `audio-${playingId}`
          ) as HTMLAudioElement | null;
          if (prevAudioElement) {
            prevAudioElement.pause();
          }
        }
        audioElement.play();
        setPlayingId(productId);

        // Start updating progress
        const interval = setInterval(() => {
          if (audioElement.paused) {
            clearInterval(interval);
          } else {
            updateProgress(audioElement, productId);
          }
        }, 500);
      }
    }
  };

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const video = e.currentTarget.querySelector("video");
    if (video) {
      video.play();
    }
  };

  const handleMouseLeave = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const video = e.currentTarget.querySelector("video");
    if (video) {
      video.pause();
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await instance.get("user/wishlist", {
        params: {
          mediaType,
          search,
          page,
          limit: 8,
        },
      });
      if (response.data) {
        setWishlistData(response.data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [mediaType, search, page]);

  const toggleDropdown = () => {
    setAssetTypeOpen(!assetTypeOpen);
  };

  const handleMediaTypeSelect = (type: string) => {
    setMediaType(type);
    setAssetTypeOpen(false);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleNextPage = () => {
    if (wishlistData && page < wishlistData.pagination.totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500">
        <ul className="list-reset flex">
          <li>
            <a href="#" className="text-blue-600">
              Catalog
            </a>
          </li>
          <li>
            <span className="mx-2">›</span>
          </li>
          <li>
            <a href="#" className="text-blue-600">
              Collections
            </a>
          </li>
          <li>
            <span className="mx-2">›</span>
          </li>
          <li className="text-gray-700">Default Collection</li>
        </ul>
      </div>

      {/* Collection Header */}
      <div className="flex justify-between items-center my-6 md:flex-row flex-col space-y-4 ">
        <div className="flex items-center">
          <img
            src="https://th.bing.com/th/id/OIP.FEqv7YYMNjXtrVYqo7HHzAHaE7?rs=1&pid=ImgDetMain"
            alt="Collection Thumbnail"
            className="rounded-lg mr-4 w-16 h-16 object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">Favourite Collection</h1>
            <p className="text-sm text-gray-500">Edited August 14, 2024</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-auto">
            <button
              className="bg-white border border-gray-300 rounded-md py-2 px-4 w-full md:w-auto flex items-center justify-between"
              onClick={toggleDropdown}
            >
              {mediaType || "Asset type"}
              <svg
                className={`ml-2 h-4 w-4 transform ${
                  assetTypeOpen ? "rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {assetTypeOpen && (
              <div className="absolute mt-2 w-full rounded-md bg-white shadow-lg border border-gray-400 z-10">
                <ul className="py-2 text-gray-700">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleMediaTypeSelect("image")}
                  >
                    Images
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleMediaTypeSelect("video")}
                  >
                    Videos
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleMediaTypeSelect("audio")}
                  >
                    Audio
                  </li>
                </ul>
              </div>
            )}
          </div>

          <input
            type="text"
            className="border border-gray-300 rounded-md py-2 px-4 w-full md:w-auto"
            placeholder="Search by title"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
        {wishlistData?.products.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg p-4"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div>
              <div className="relative">
                {product.mediaType === "image" && (
                  <img
                    className="rounded-lg object-cover w-full h-48"
                    src={`https://mi2-public.s3.ap-southeast-1.amazonaws.com/${product.thumbnailKey}`}
                    alt={product.title}
                  />
                )}
                <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                  OFF
                </span>
              </div>
              <div className="relative">
                {product.mediaType === "video" && (
                  <video
                    loop
                    muted
                    className="w-full h-48 object-cover cursor-pointer"
                  >
                    <source
                      src={`https://mi2-public.s3.ap-southeast-1.amazonaws.com/${product.thumbnailKey}`}
                    />
                  </video>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <p className="text-white">4k 0:17</p>
                </div>
              </div>

              <div className="relative">
              {product.mediaType === "audio" && (
              <div className="relative">
                <audio id={`audio-${product._id}`}>
                  <source
                    src={`https://mi2-public.s3.ap-southeast-1.amazonaws.com/${product.thumbnailKey}`}
                    type="audio/mpeg"
                  />
                </audio>
                <div className="flex items-center justify-center relative bg-gray-100 rounded-lg h-36 w-full">
                  <button
                    onClick={() =>
                      togglePlay(
                        product._id,
                        document.getElementById(
                          `audio-${product._id}`
                        ) as HTMLAudioElement | null
                      )
                    }
                    className="text-black bg-white p-3 rounded-full shadow-md"
                  >
                    {playingId === product._id ? (
                      <IoIosPause className="h-6 w-6" />
                    ) : (
                      <IoIosPlay className="h-6 w-6" />
                    )}
                  </button>
                </div>
                <div className="w-full mt-4 h-2 bg-gray-200 rounded-lg">
                  <div
                    className="h-full bg-gray-500 rounded-lg"
                    style={{
                      width: `${progress[product._id] || 0}%`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-700">2:26</p>
                  <p className="text-sm text-gray-700">110 BPM</p>
                </div>
              </div>
            )}
              </div>
            </div>
            <h2 className="mt-2 text-lg font-bold">{product.title}</h2>
            <p className="text-gray-500">{product.mediaType}</p>
            <p className="text-green-500 text-xs">saved</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-6">
        <button
          className="px-4 py-2 mx-1 bg-webgreen text-white rounded-lg disabled:opacity-50"
          onClick={handlePreviousPage}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="px-4 py-2">
          {wishlistData?.pagination.currentPage} /{" "}
          {wishlistData?.pagination.totalPages}
        </span>
        <button
          className="px-4 py-2 mx-1 bg-webgreen text-white rounded-lg disabled:opacity-50"
          onClick={handleNextPage}
          disabled={
            wishlistData?.pagination.currentPage ===
            wishlistData?.pagination.totalPages
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Collection;
