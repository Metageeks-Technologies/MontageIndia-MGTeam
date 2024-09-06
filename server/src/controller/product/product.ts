import catchAsyncError from "@src/middleware/catchAsyncError.js";
import ErrorHandler from "@src/utils/errorHandler.js";
import Product from "@src/model/product/product";
import Activity from "@src/model/activity/activity";
import type { TAdmin, TCustomer } from "@src/types/user";
import Customer from "@src/model/user/customer.js";
import { getObject } from "@src/lib/uploadToS3";
import { MetaData } from "@src/types/product";

export const createProduct = catchAsyncError(async (req: any, res, next) => {
  req.body.createdBy = req.user._id;

  const product = await Product.create(req.body);

  const activity = {
    adminId: req.user._id,
    name: req.user.name,
    email: req.user.email,
    username: req.user.username,
    action: "create",
    category: req.body.category,
    productId: product._id,
    timestamp: Date.now(),
  };

  await Activity.create(activity);

  res.status(201).json({
    success: true,
    product,
  });
});

export const getProduct = catchAsyncError(async (req, res, next) => {
  const { id: uuid } = req.params;
  console.log(uuid);
  const product = await Product.findOne({ uuid });
  console.log(product);
  res.status(201).json({
    success: true,
    product,
  });
});

export const getProducts = catchAsyncError(async (req: any, res, next) => {
  const {
    productsPerPage = "20",
    page = "1",
    status = "published",
    category = [],
    mediaType = [],
    searchTerm = "",
    tags,
  } = req.query;

  let user: TAdmin | null = null;
  if ("user" in req) {
    user = req.user as TAdmin;
  }
  console.log(user, "user");

  const queryObject: any = {};

  if (status) {
    queryObject.status = status;
  }
  if (user?.role !== "superadmin") {
    console.log("false");
    queryObject.createdBy = user?._id;
  }

  if (searchTerm) {
    queryObject.$or = [
      { title: { $regex: searchTerm, $options: "i" } },
      { tags: { $regex: searchTerm, $options: "i" } },
    ];
  }

  if (Array.isArray(category) && category.length > 0) {
    queryObject.category = { $in: category };
  }

  if (Array.isArray(mediaType) && mediaType.length > 0) {
    queryObject.mediaType = { $in: mediaType };
  }

  if (tags) {
    const nTag = tags as string;
    const tagsArray = Array.isArray(nTag) ? nTag : nTag.split(","); // Ensure tags are in array format
    queryObject.tags = { $all: tagsArray };
  }

  if (req.user.role !== "superadmin") {
    queryObject.createdBy = req.user._id;
  }

  console.log("queryObject", queryObject);

  const p = Number(page) || 1;
  const limit = Number(productsPerPage);
  const skip = (p - 1) * Number(limit);

  let products = await Product.find(queryObject)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  const totalData = await Product.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalData / limit);

  res.status(200).json({
    success: true,
    products,
    totalData,
    numOfPages,
  });
});

export const getProductData = catchAsyncError(async (req: any, res, next) => {
  let products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});
export const updateProduct = catchAsyncError(async (req: any, res, next) => {
  const { id: uuid } = req.params;
  console.log(uuid);
  console.log(req.body);
  const product = await Product.findOneAndUpdate({ uuid }, req.body);
  // console.log("updatedbody",req);
  const activity = {
    adminId: req.user._id,
    name: req.user.name,
    email: req.user.email,
    username: req.user.username,
    action: "update",
    category: req.body.category ? req.body.category : "unknown",
    productId: product?._id,
    timestamp: Date.now(),
  };

  await Activity.create(activity);

  res.status(201).json({
    success: true,
    product,
  });
});

export const addSizeAndKeysToVideo = catchAsyncError(
  async (req: any, res, next) => {
    const { uuid, mediaType } = req.body;

    if (mediaType !== "video") {
      return next(new ErrorHandler("media type should be video", 400));
    }
    const originalMetadata: MetaData = {
      resolution: "1920x1080", //Px
      bitrate: 5, //Mbps
      frameRate: "30", //Hz
      format: "mp4",
      size: 1,
    };
    const mediumMetadata: MetaData = {
      resolution: "1280x720", //Px
      bitrate: 2, //Mbps
      frameRate: "24", //Hz
      format: "mp4",
      size: 1,
    };

    const variants = [
      { metadata: originalMetadata, key: `${uuid}/video/${uuid}-original.mp4` },
      { metadata: mediumMetadata, key: `${uuid}/video/${uuid}-medium.mp4` },
    ];

    const publicKey = `${uuid}/video/${uuid}-product_page.webm`;
    const thumbnailKey = `${uuid}/video/${uuid}-thumbnail.webm`;

    const updatedProduct: any = await Product.findOneAndUpdate(
      { uuid }, // find the product by uuid
      { $set: { variants, publicKey, thumbnailKey } }, // set the fields to update
      { new: true } // return the updated document
    );

    const activity = {
      adminId: req.user._id,
      name: req.user.name,
      email: req.user.email,
      username: req.user.username,
      action: "update",
      category: req.body.category ? req.body.category : "unknown",
      productId: updatedProduct?._id,
      timestamp: Date.now(),
    };

    await Activity.create(activity);

    res.json({ success: true, product: updatedProduct });
  }
);

export const addPriceToVariant = catchAsyncError(
  async (req: any, res, next) => {
    const { id: vid } = req.params;
    const { uuid, price, label, credit } = req.body;

    const product = await Product.findOne({ uuid });

    if (!product) {
      return next(new ErrorHandler(`product not found`, 404));
    }
    const variantIndex = product.variants.findIndex(
      (variant) => variant._id?.toString() === vid
    );
    if (variantIndex === -1) {
      return next(
        new ErrorHandler(`variant not found with the given field`, 404)
      );
    }
    const updateFields: any = {};
    if (label) updateFields[`variants.${variantIndex}.label`] = label;
    if (price) updateFields[`variants.${variantIndex}.price`] = price;
    if (credit) updateFields[`variants.${variantIndex}.credit`] = credit;

    const result = await Product.updateOne(
      { uuid, "variants._id": vid },
      { $set: updateFields },
      {
        arrayFilters: [{ "elem._id": vid }],
      }
    );
    const updatedProduct = await Product.findOne({ uuid });
    console.log("updatedProduct", updatedProduct);

    const activity = {
      adminId: req.user._id,
      name: req.user.name,
      email: req.user.email,
      username: req.user.username,
      action: "update",
      category: req.body.category ? req.body.category : "unknown",
      productId: updatedProduct?._id,
      timestamp: Date.now(),
    };
    console.log("activity", activity);

    await Activity.create(activity);

    res.status(201).json({
      success: true,
      product: updatedProduct,
    });
  }
);

// get products by ids, for cart
export const getProductsByIds = catchAsyncError(async (req: any, res, next) => {
  try {
    const id = req.user;
    const user = await Customer.findById(id).populate("cart.product");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(404).json({ message: "Not Authenticated" });
  }
});

export const buyWithCredits = catchAsyncError(async (req: any, res, next) => {
  const { id } = req.user;
  const { productBody } = req.body;
  const { productId, variantId } = productBody;

  const user = await Customer.findById(id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const variantIndex = product.variants.findIndex(
    (variant) => variant?._id?.toString() === variantId
  );

  if (variantIndex === -1) {
    return next(new ErrorHandler("Variant not found", 404));
  }

  const userCredits = user.subscription.credits;
  const productCredit = product.variants[variantIndex].credit;

  if (!productCredit || productCredit <= 0) {
    return next(new ErrorHandler("Product credit not found", 404));
  }

  if (userCredits < productCredit) {
    return next(new ErrorHandler("Insufficient credits", 400));
  }

  const existingProduct = user.purchasedProducts.find(
    (item) => item.productId.toString() === productId.toString()
  );

  if (existingProduct) {
    const existingVariant =
      existingProduct.variantId.toString() === variantId.toString();

    if (existingVariant) {
      throw new Error("Product with the same variant ID already exists.");
    } else {
      // Add a new entry with the product ID and new variant ID
      user.purchasedProducts.push({
        productId: productId,
        variantId: variantId,
      });
    }
  } else {
    // Add the new product with variant ID
    user.purchasedProducts.push({
      productId: productId,
      variantId: variantId,
    });
  }

  // Deduct credits
  user.subscription.credits = userCredits - productCredit;

  // Remove product from cart if it exists
  user.cart = user.cart.filter(
    (item) => item.productId.toString() !== productId.toString()
  );

  await user.save();

  res.send({ success: true, user, message: "Purchased successfully" });
});

export const buyAllCartWithCredits = catchAsyncError(
  async (req: any, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("User not found", 404));
    }
    const { id } = req.user;
    const user = await Customer.findById(id).populate("cart.productId");
    if (!user) {
      return next(new ErrorHandler("User not found or cart is empty.", 404));
    }

    let totalCredit = 0;

    // console.log("user.cart", user.cart);
    if (!user.cart || user?.cart?.length === 0) {
      return next(new ErrorHandler("Cart is empty", 404));
    }

    user.cart.forEach((item) => {
      const product: any = item.productId;
      const variantId = item.variantId;

      const variant = product.variants.find(
        (variant: any) => variant._id.toString() === variantId
      );
      if (variant) {
        totalCredit += variant.credit;
      }
    });

    const totalUserCredit = user.subscription.credits;
    if (totalUserCredit < totalCredit) {
      return next(new ErrorHandler("Insufficient credits", 400));
    }

    for (const product of user.cart) {
      const { productId, variantId } = product;

      const existingProduct = user.purchasedProducts.find(
        (item) => item.productId.toString() === productId.toString()
      );

      if (existingProduct) {
        const existingVariant =
          existingProduct.variantId.toString() === variantId.toString();

        if (existingVariant) {
          throw new Error("Product with the same variant ID already exists.");
        } else {
          // Add a new entry with the product ID and new variant ID
          user.purchasedProducts.push({
            productId: productId,
            variantId: variantId,
          });
        }
      } else {
        // Add the new product with variant ID
        user.purchasedProducts.push({
          productId: productId,
          variantId: variantId,
        });
      }
    }
    // Deduct credits
    user.subscription.credits = totalUserCredit - totalCredit;

    user.cart = [];
    await user.save();
    res.send({ success: true, user, message: "Purchased successfully" });
  }
);

export const getPurchasedProducts = catchAsyncError(
  async (req: any, res, next) => {
    try {
      const { id } = req.user;
      const { searchTerm, currentPage = 1, dataPerPage = 6 } = req.query;
      console.log("searchTerm", searchTerm, currentPage, dataPerPage);

      const customer = await Customer.findById(id)
        .populate("purchasedProducts.productId")
        .populate("purchasedProducts.variantId");

      if (!customer) {
        return next(new ErrorHandler(`customer not found`, 404));
      }
      console.log("customer", customer);

      let purchasedProducts = customer?.purchasedProducts?.map((item: any) => ({
        product: item.productId,
        variant: item.variantId,
        createdAt: item.createdAt,
      }));

      if (searchTerm) {
        const regex = new RegExp(searchTerm, "i");
        purchasedProducts = purchasedProducts.filter(
          (item: any) =>
            regex.test(item.product.title) ||
            regex.test(item.variant.label) ||
            regex.test(item.product.tags.join(" ")) ||
            regex.test(item.product.mediaType)
        );
      }

      purchasedProducts.sort((a: any, b: any) => {
        const dateA: number = new Date(a.createdAt).getTime();
        const dateB: number = new Date(b.createdAt).getTime();
        return dateA - dateB;
      });

      // Pagination
      const totalPurchased = purchasedProducts.length;
      const totalPages = Math.ceil(totalPurchased / dataPerPage);
      const paginatedProducts = purchasedProducts.slice(
        (currentPage - 1) * dataPerPage,
        currentPage * dataPerPage
      );

      res.send({
        success: true,
        purchasedProducts: paginatedProducts,
        totalPurchased,
        totalPages,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

// customer side controller
export const getProductForCustomer = catchAsyncError(
  async (req: any, res, next) => {
    const {
      productsPerPage = "10",
      page = "1",
      status = "published",
      category = [],
      mediaType = [],
      searchTerm = "",
      tags,
      popular,
    } = req.query;
    console.log("dsd", category, searchTerm);

    const queryObject: any = {};

    if (status) {
      queryObject.status = "published";
    }

    if (searchTerm) {
      queryObject.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { tags: { $regex: searchTerm, $options: "i" } },
        { category: { $regex: searchTerm, $options: "i" } },
      ];
    }

    if (Array.isArray(category) && category.length > 0) {
      queryObject.category = { $in: category };
    }

    if (Array.isArray(mediaType) && mediaType.length > 0) {
      queryObject.mediaType = { $in: mediaType };
    }

    if (tags) {
      const nTag = tags as string;
      const tagsArray = Array.isArray(nTag) ? nTag : nTag.split(","); // Ensure tags are in array format
      queryObject.tags = { $all: tagsArray };
    }

    if (popular) {
      const popularProducts = await Customer.aggregate([
        {
          $project: {
            allProducts: {
              $concatArrays: [
                "$wishlist.productId",
                "$cart.productId",
                "$purchasedProducts.productId",
              ],
            },
          },
        },
        { $unwind: "$allProducts" },
        { $group: { _id: "$allProducts" } },
        { $project: { _id: 1 } },
      ]);

      const popularProductIds = popularProducts.map((p) => p._id);
      queryObject._id = { $in: popularProductIds };
    }

    let isWhitelisted = false;
    let isInCart = false;
    let isPurchased = false;
    let wishlist: any = [];
    let cart: any = [];
    let purchasedProducts: any = [];

    if (req.user) {
      const customerId = req.user._id;
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return next(new ErrorHandler(`customer not found`, 404));
      }
      wishlist = customer.wishlist;
      cart = customer.cart;
      purchasedProducts = customer.purchasedProducts;
    }

    const p = Number(page) || 1;
    const limit = Number(productsPerPage);
    const skip = (p - 1) * Number(limit);

    let products = await Product.find(queryObject)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    const totalData = await Product.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalData / limit);
    let result = products.map((product) => {
      if (req.user) {
        isWhitelisted = wishlist?.some(
          (p: any) => p.productId.toString() === product._id.toString()
        );
        isInCart = cart?.some(
          (p: any) => p.productId.toString() === product._id.toString()
        );
        isPurchased = purchasedProducts?.some(
          (p: any) => p.productId.toString() === product._id.toString()
        );
      }

      const productObject = product.toObject();
      return {
        ...productObject,
        isWhitelisted,
        isInCart,
        isPurchased,
      };
    });

    const relatedKeywords = new Set<string>();
    products.forEach((product) => {
      const { title, description, category, tags } = product;
      const words = [
        ...title.split(" "),
        ...description.split(" "),
        ...category,
        ...tags,
      ];
      words.forEach((word) => {
        if (word.length > 3) {
          relatedKeywords.add(word.toLowerCase());
        }
      });
    });

    // let relatedKeywords = await getRelatedKeywords(searchTerm);

    res.status(200).json({
      success: true,
      totalData,
      numOfPages,
      products: result,
      relatedKeywords: Array.from(relatedKeywords).slice(0, 16),
    });
  }
);

export const getFilteredProducts =  catchAsyncError(async (req: any, res, next) => {
      const {
      productsPerPage = "10",
      page = "1",
      status = "published",
      category = [],
      mediaType = "image",
      searchTerm = "",
      tags,
      sortBy,
      orientation,
      imageWidth,
      imageHeight,
      imageFileType,
      dpi,
      videoResolution,
      videoLength,
      videoFrameRate,
      audioLength,
      audioBitrate,
    } = req.query;
    console.log("req.query", req.query);

    const queryObject: any = {};

    if(status){
      queryObject.status = "published";
    }

    if(searchTerm){
      queryObject.$or = [
        {title: {$regex: searchTerm, $options: "i"}},
        {tags: {$regex: searchTerm, $options: "i"}},
        {category: {$regex: searchTerm, $options: "i"}},
      ];
    }

    if(Array.isArray(category) && category.length > 0){
      queryObject.category = { $in: category };
    }
    if(tags){
      const nTag = tags as string;
      const tagsArray = Array.isArray(nTag) ? nTag : nTag.split(","); // Ensure tags are in array format
      queryObject.tags = { $all: tagsArray };
    }

    if(mediaType){
      queryObject.mediaType = mediaType;
    }
    let sortCriteria: { [key: string]: 1 | -1 } = { createdAt: -1 };

    if (sortBy === 'newest') {
      sortCriteria = { createdAt: -1 };
    } 

    if(sortBy === 'oldest') {
      sortCriteria = { createdAt: 1 };
    } 

    if (sortBy==="popular") {
      const popularProducts = await Customer.aggregate([
        {
          $project: {
            allProducts: {
              $concatArrays: [
                "$wishlist.productId",
                "$cart.productId",
                "$purchasedProducts.productId",
              ],
            },
          },
        },
        { $unwind: "$allProducts" },
        { $group: { _id: "$allProducts" } },
        { $project: { _id: 1 } },
      ]);

      const popularProductIds = popularProducts.map((p) => p._id);
      queryObject._id = { $in: popularProductIds };
    }
    //image
    if(mediaType.includes("image")){
      if(imageFileType){
        queryObject["variants.metadata.format"] = imageFileType;
      }
      if(dpi){
        queryObject["variants.metadata.dpi"] = {$gte: dpi};
      }
      if(imageWidth && imageHeight){
        queryObject["variants.metadata.dimension"] = { $regex:new RegExp(`${imageWidth}x${imageHeight}`, 'i')};
      }
    }
    //video
    if(mediaType.includes("video")){
      if (videoLength) {
        queryObject.length = {
          $gte: (Number(videoLength) - 10)<0? 0:(Number(videoLength) - 10), 
          $lte: Number(videoLength) + 10,
        };
      }

      if(videoFrameRate) queryObject["variants.metadata.frameRate"] = videoFrameRate;

      if (videoResolution) {
        const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const escapedVideoResolution = escapeRegex(videoResolution as string);
         const substringMatchRegex = new RegExp(`${escapedVideoResolution}`, 'i');

    if (escapedVideoResolution) {
      queryObject['variants.metadata.resolution'] = { $regex: substringMatchRegex };
    }
      }

    }
    //audio
    if(mediaType.includes("audio")){
      if(audioLength){
        queryObject["variants.metadata.length"] = {
          $gte: Number(audioLength) - 5,
          $lte: Number(audioLength) + 5,
        };
        }
      if(audioBitrate){
        queryObject["variants.metadata.bitrate"] = {
          $gte: Number(audioBitrate) - 5, 
          $lte: Number(audioBitrate) + 5,
        };
        }
    }

    const p = Number(page) || 1;
    const limit = Number(productsPerPage);
    const skip = (p - 1) * Number(limit);

    console.log("queryObject", queryObject);

    let products = await Product.find(queryObject).
      sort(sortCriteria)
      .skip(skip)
      .limit(Number(limit));

    console.log("products", products);
    const totalData = await Product.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalData / limit);

    return res.status(200).json({
      success: true,
      totalData,
      numOfPages,
      products,
    });
});

export const getSingleProductForCustomer = catchAsyncError(
  async (req: any, res, next) => {
    const { id: uuid } = req.params;

    if (!uuid) {
      return next(new ErrorHandler(`Product ID is required`, 400));
    }

    const product = await Product.findOne({ uuid });

    if (!product) {
      return next(new ErrorHandler(`Product not found`, 404));
    }

    let isWhitelisted = false;
    let isInCart = false;
    let isPurchased = false;
    let wishlist: any = [];
    let cart: any = [];
    let purchasedProducts: any = [];

    if (req.user) {
      const customerId = req.user._id;
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return next(new ErrorHandler(`Customer not found`, 404));
      }
      wishlist = customer.wishlist;
      cart = customer.cart;
      purchasedProducts = customer.purchasedProducts;

      isWhitelisted = wishlist?.some(
        (p: any) => p.productId.toString() === product._id.toString()
      );
      isInCart = cart?.some(
        (p: any) => p.productId.toString() === product._id.toString()
      );
      isPurchased = purchasedProducts?.some(
        (p: any) => p.productId.toString() === product._id.toString()
      );
    }

    const productObject = product.toObject();
    const result = {
      ...productObject,
      isWhitelisted,
      isInCart,
      isPurchased,
    };

    const similarResult = await getSimilarProduct(req.user, product);

    // Find similar products

    res.status(200).json({
      success: true,
      product: result,
      similar: similarResult,
    });
  }
);

export const addToWishlist = catchAsyncError(async (req: any, res, next) => {
  const { productId, variantId } = req.body;

  console.log("productId", productId);
  console.log("variantId", variantId);
  const customerId = req.user._id;

  // Check if variantId is provided
  if (!variantId) {
    return next(new ErrorHandler(`variantId is required`, 400));
  }

  const customer = await Customer.findById(customerId);
  if (!customer) {
    return next(new ErrorHandler(`Customer not found`, 404));
  }

  // Check if the product is already in the wishlist
  const productInWishlist = customer.wishlist.find(
    (item) => item.productId.toString() === productId.toString()
  );

  if (productInWishlist) {
    return next(new ErrorHandler(`Product already in wishlist`, 400));
  }

  // Add the product to the wishlist

  const newWishlistItem = { productId, variantId };
  await Customer.findOneAndUpdate(
    { _id: customer._id },
    { $push: { wishlist: newWishlistItem } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Product added to wishlist",
  });
});

export const removeFromWishlist = catchAsyncError(
  async (req: any, res, next) => {
    const { productId } = req.body;
    console.log("productId", productId);
    const customerId = req.user._id;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return next(new ErrorHandler(`customer not found`, 404));
    }

    const productIndex = customer.wishlist.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (productIndex === -1) {
      return next(new ErrorHandler(`Product not in wishlist`, 400));
    }

    // Remove the product from the wishlist
    await Customer.findOneAndUpdate(
      { _id: customer._id },
      { $pull: { wishlist: { productId } } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
    });
  }
);

export const getWishlist = catchAsyncError(async (req: any, res, next) => {
  const customerId = req.user._id;
  if (!customerId) {
    return next(new ErrorHandler(`customer not found`, 404));
  }

  let isWhitelisted = false;
  let isInCart = false;
  let isPurchased = false;
  let wishlist: any = [];
  let cart: any = [];
  let purchasedProducts: any = [];

  const customer = await Customer.findById(customerId);
  if (!customer) {
    return next(new ErrorHandler(`customer not found`, 404));
  }

  const products = await Product.find({
    _id: { $in: customer.wishlist.map((item) => item.productId) },
  });

  // console.log("products", products);

  wishlist = customer.wishlist;
  cart = customer.cart;
  purchasedProducts = customer.purchasedProducts;

  let result = products.map((product) => {
    isWhitelisted = wishlist?.some(
      (p: any) => p.productId.toString() === product._id.toString()
    );
    isInCart = cart?.some(
      (p: any) => p.productId.toString() === product._id.toString()
    );
    isPurchased = purchasedProducts?.some(
      (p: any) => p.productId.toString() === product._id.toString()
    );

    const productObject = product.toObject();
    return {
      ...productObject,
      isWhitelisted,
      isInCart,
      isPurchased,
    };
  });

  res.status(200).json({
    success: true,
    products: result,
  });
});

export const addToCart = catchAsyncError(async (req: any, res, next) => {
  const { productId, variantId } = req.body;
  const customerId = req.user._id;

  if (!variantId) {
    return next(new ErrorHandler(`variantId is required`, 400));
  }

  const customer = await Customer.findById(customerId);
  if (!customer) {
    return next(new ErrorHandler(`customer not found`, 404));
  }
  const productInCart = customer.cart.find(
    (item) => item.productId.toString() === productId.toString()
  );
  const variantInCart = customer.cart.find(
    (item) => item.variantId.toString() === variantId.toString()
  );

  if (productInCart && variantInCart) {
    return next(
      new ErrorHandler(`Product already in cart with given variant`, 400)
    );
  }

  const newCartItem = { productId, variantId };
  const updatedCustomer = await Customer.findOneAndUpdate(
    { _id: customer._id, "cart.productId": productId },
    { $set: { "cart.$.variantId": variantId } },
    { new: true }
  );

  if (!updatedCustomer) {
    await Customer.findOneAndUpdate(
      { _id: customer._id },
      { $push: { cart: newCartItem } },
      { new: true }
    );
  }

  res.status(200).json({
    success: true,
    message: "Product added to cart",
  });
});

export const createCart = catchAsyncError(async (req: any, res, next) => {
  const { cart } = req.body;
  const customerId = req.user._id;
  if (!cart) {
    return next(new ErrorHandler(`cart is required`, 400));
  }
  if (!customerId) {
    return next(new ErrorHandler(`customerId is required`, 400));
  }

  const customer = await Customer.findById(customerId);
  if (!customer) {
    return next(new ErrorHandler(`customer not found`, 404));
  }
  const userCart = customer.cart;

  if (!userCart || userCart.length === 0) {
    customer.cart = cart;
    await customer.save();
  } else {
    const newCart = [...userCart, ...cart];
    customer.cart = newCart;
    await customer.save();
  }

  res.status(200).json({
    success: true,
    message: "Cart created",
  });
});

export const removeFromCart = catchAsyncError(async (req: any, res, next) => {
  const { productId } = req.body;
  const customerId = req.user._id;

  const customer = await Customer.findById(customerId);
  if (!customer) {
    return next(new ErrorHandler(`customer not found`, 404));
  }

  const productIndex = customer.cart.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  if (productIndex === -1) {
    return next(new ErrorHandler(`Product not in cart`, 400));
  }

  await Customer.findOneAndUpdate(
    { _id: customer._id },
    { $pull: { cart: { productId } } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Product removed from cart",
  });
});

export const getCart = catchAsyncError(async (req: any, res, next) => {
  const customerId = req.user._id;

  const customer = await Customer.findById(customerId).populate(
    "cart.productId"
  );
  if (!customer) {
    return next(new ErrorHandler(`customer not found`, 404));
  }

  res.status(200).json({
    success: true,
    products: customer.cart,
  });
});

export const getProductFromAws = catchAsyncError(
  async (req: any, res, next) => {
    const { key } = req.query;

    const url = await getObject(key);

    res.status(200).json({
      success: true,
      url,
    });
  }
);

export const getRelatedKeywords = async (searchTerm: string) => {
  if (!searchTerm) {
    return [];
  }

  const relatedKeywordsPipeline: any[] = [
    {
      $match: {
        $text: { $search: searchTerm },
      },
    },
    {
      $project: {
        title: 1,
        tags: 1,
        description: 1,
        category: 1,
      },
    },
    {
      $unwind: {
        path: "$tags",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: null,
        keywords: {
          $push: {
            $concatArrays: [
              { $ifNull: [{ $split: ["$title", " "] }, []] },
              { $ifNull: [{ $split: ["$description", " "] }, []] },
              { $ifNull: ["$tags", []] },
              { $ifNull: [{ $split: ["$category", " "] }, []] },
            ],
          },
        },
      },
    },
    {
      $unwind: "$keywords",
    },
    {
      $unwind: "$keywords",
    },
    {
      $group: {
        _id: "$keywords",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 16,
    },
    {
      $project: {
        _id: 0,
        keyword: "$_id",
      },
    },
  ];

  const relatedKeywords = await Product.aggregate(relatedKeywordsPipeline);
  return relatedKeywords.map((k) => k.keyword);
};

export const getSimilarProduct = async (user: any, product: any) => {
  let isWhitelisted = false;
  let isInCart = false;
  let isPurchased = false;
  let wishlist: any = [];
  let cart: any = [];
  let purchasedProducts: any = [];

  if (user) {
    const customerId = user._id;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw Error("customer not found");
    }
    wishlist = customer.wishlist;
    cart = customer.cart;
    purchasedProducts = customer.purchasedProducts;
  }

  const similarProducts = await Product.find({
    $text: {
      $search:
        product.title +
        " " +
        product.tags.join(" ") +
        " " +
        product.category.join(" ") +
        " " +
        product.description,
    },
    mediaType: product.mediaType,
    _id: { $ne: product._id }, // Exclude the current product
  })
    .limit(16)
    .exec();
  let similarResult = similarProducts.map((product) => {
    if (user) {
      isWhitelisted = wishlist?.some(
        (p: any) => p.productId.toString() === product._id.toString()
      );
      isInCart = cart?.some(
        (p: any) => p.productId.toString() === product._id.toString()
      );
      isPurchased = purchasedProducts?.some(
        (p: any) => p.productId.toString() === product._id.toString()
      );
    }

    const productObject = product.toObject();
    return {
      ...productObject,
      isWhitelisted,
      isInCart,
      isPurchased,
    };
  });

  return similarResult;
};
