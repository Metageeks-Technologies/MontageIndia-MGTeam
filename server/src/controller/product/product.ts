import catchAsyncError from '@src/middleware/catchAsyncError.js';
import ErrorHandler from '@src/utils/errorHandler.js';
import Product from '@src/model/product/product';

export const createProduct = catchAsyncError(async (req, res, next) => {
    
    const product= await Product.create(req.body);
    
    res.status(201).json({
        success: true,
        product    
    })
})

export const getProduct = catchAsyncError(async (req, res, next) => {
    
    const {id:uuid}=req.params;
    const product= await Product.findOne({uuid});
    
    res.status(201).json({
        success: true,
        product    
    })
})

export const getProducts = catchAsyncError(async (req, res, next) => {
    
    const {page,status,mediaType,tags,category}= req.query;
    const queryObject:any = {};

    if(status){
        queryObject.status=status;
    }
    if(mediaType){
        queryObject.mediaType = mediaType;
    }
    if (tags) {
        const nTag = tags as string;
        const tagsArray = Array.isArray(nTag) ? nTag : nTag.split(','); // Ensure tags are in array format
        queryObject.tags = { $all: tagsArray };
    }
    if (category) {
        const nCategory = category as string;
        const tagsArray = Array.isArray(nCategory) ? nCategory : nCategory.split(','); // Ensure tags are in array format
        queryObject.tags = { $all: tagsArray };
    }
    

    const p = Number(page) || 1;
    const limit = 8;
    const skip = (p - 1) * limit;

  let products = await Product.find(queryObject).skip(skip).limit(limit);
  const totalData = await Product.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalData / limit);
    
    res.status(200).json({
        success: true,
        products,
        totalData,
        numOfPages
    })
})

export const updateProduct = catchAsyncError(async (req, res, next) => {
    
    const {id:uuid}= req.params;
    
    const products= await Product.findOneAndUpdate({uuid},req.body); 
    res.status(201).json({
        success: true,
        products    
    })
});

export const addSizeAndKeysToVideo =  catchAsyncError(async (req, res, next) => {
    
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

    const updatedProduct = await Product.findOneAndUpdate(
        { uuid }, // find the product by uuid
        { $set: { variants, publicKey, thumbnailKey } }, // set the fields to update
        { new: true } // return the updated document
      );
  

    res.json({ success: true,
        product:updatedProduct
    });
});

export const addPriceToVariant = catchAsyncError(async (req, res, next) => {
    
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
    
    res.status(201).json({
        success: true,
        product :updatedProduct   
    });
})
