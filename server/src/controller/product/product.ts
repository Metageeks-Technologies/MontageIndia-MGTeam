import catchAsyncError from '@src/middleware/catchAsyncError.js';
import ErrorHandler from '@src/utils/errorHandler.js';
import Product from '@src/model/product/product';
import Activity from '@src/model/activity/activity';

export const createProduct = catchAsyncError(async (req: any, res, next) => {
    
    // console.log("create product",req.body);
    const {category} = req.body;
    const product= await Product.create(req.body);
    
    const activity={
        adminId: req.user._id,
        name: req.user.name,
        email: req.user.email,
        username: req.user.username,
        action: 'create',
        category: category[0],
        productId: product._id,
        timestamp: Date.now()
    }

    await Activity.create(activity);

    res.status(201).json({
        success: true,
        product    
    });
    
})

export const getProduct = catchAsyncError(async (req, res, next) => {
    
    const {id:uuid}=req.params;
    console.log(uuid)
    const product= await Product.findOne({uuid});
    console.log(product)
    res.status(201).json({
        success: true,
        product    
    })
})

export const getProducts = catchAsyncError(async (req, res, next) => {
    
   const {productsPerPage='20', page = '1', status = 'published', category = [], mediaType = [], searchTerm = '',tags } = req.query;

    const queryObject:any = {};

    if(status){
        queryObject.status=status;
    }

    if (searchTerm) {
        queryObject.$or = [
            { title: { $regex: searchTerm, $options: 'i' } },
            { tags: { $regex: searchTerm, $options: 'i' } }
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
        const tagsArray = Array.isArray(nTag) ? nTag : nTag.split(','); // Ensure tags are in array format
        queryObject.tags = { $all: tagsArray };
    }

    console.log("queryObject",queryObject);
    
    const p = Number(page) || 1;
    const limit = Number(productsPerPage);
    const skip = (p - 1) * Number(limit);
    
  let products = await Product.find(queryObject).skip(skip).limit(Number(limit));
  const totalData = await Product.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalData / limit);
    
    res.status(200).json({
        success: true,
        products,
        totalData,
        numOfPages
    })
})

export const updateProduct = catchAsyncError(async (req: any, res, next) => {
    
    const {id:uuid}= req.params;
        console.log(uuid)
        console.log(req.body)
    const product= await Product.findOneAndUpdate({uuid},req.body); 
    // console.log("updatedbody",req);
    const activity={
        adminId: req.user._id,
        name: req.user.name,
        email: req.user.email,
        username: req.user.username,
        action: 'update',
        category: req.body.category?req.body.category:"unknown",
        productId: product?._id,
        timestamp: Date.now(),
    }

    await Activity.create(activity);

    res.status(201).json({
        success: true,
        product 
    })
});

export const addSizeAndKeysToVideo =  catchAsyncError(async (req:any, res, next) => {
    
    const { uuid,mediaType } = req.body;

    if(mediaType!=='video'){
        return next(new ErrorHandler("media type should be video", 400));
    };

    const variants = [
        { size: 'original', key: `${uuid}/video/${uuid}-original.mp4`},
        { size: 'medium', key: `${uuid}/video/${uuid}-medium.mp4`},
        { size: 'small', key: `${uuid}/video/${uuid}-small.mp4`},
    ];

    const publicKey =`${uuid}/video/${uuid}-product_page.webm`;
    const thumbnailKey = `${uuid}/video/${uuid}-thumbnail.webm`;

    const updatedProduct:any = await Product.findOneAndUpdate(
        { uuid }, // find the product by uuid
        { $set: { variants, publicKey, thumbnailKey } }, // set the fields to update
        { new: true } // return the updated document
      );
    
    const activity={
        adminId: req.user._id,
        name: req.user.name,
        email: req.user.email,
        username: req.user.username,
        action: 'update',
        category: req.body.category?req.body.category:"unknown",
        productId: updatedProduct?._id,
        timestamp: Date.now(),
    }

    await Activity.create(activity);

    res.json({ success: true,
        product:updatedProduct
    });
});

export const addPriceToVariant = catchAsyncError(async (req:any, res, next) => {
    
    const {id:vid} = req.params;
    const {uuid,price,label} =  req.body;

    const product  =  await Product.findOne({uuid});

    if (!product) {
        return next(new ErrorHandler(`product not found`, 404));
    }
    const variantIndex = product.variants.findIndex(variant => variant._id?.toString() === vid);
    if (variantIndex === -1) {
        return next(new ErrorHandler(`variant not found with the given field`, 404));
    };
    const updateFields:any = {};
    if (label) updateFields[`variants.${variantIndex}.label`] = label;
    if (price) updateFields[`variants.${variantIndex}.price`] = price;

    const result = await Product.updateOne(
        { uuid, "variants._id": vid },
        { $set: updateFields },
        {
          arrayFilters: [{ "elem._id": vid }],
        }
      );
      const updatedProduct = await Product.findOne({uuid});
        console.log("updatedProduct",updatedProduct);

        const activity={
        adminId: req.user._id,
        name: req.user.name,
        email: req.user.email,
        username: req.user.username,
        action: 'update',
        category: req.body.category?req.body.category:"unknown",
        productId: updatedProduct?._id,
        timestamp: Date.now(),
    }
    console.log("activity",activity);
    
    await Activity.create(activity);
    
    res.status(201).json({
        success: true,
        product :updatedProduct   
    });
})
