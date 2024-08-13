import catchAsyncError from '@src/middleware/catchAsyncError.js';
import ErrorHandler from '@src/utils/errorHandler.js';
import Product from '@src/model/product/product';
import Activity from '@src/model/activity/activity';
import type { TAdmin, TCustomer } from '@src/types/user';
import Customer from '@src/model/user/customer.js';

export const createProduct = catchAsyncError(async (req: any, res, next) => {
    
    req.body.createdBy = req.user._id;

    const product= await Product.create(req.body);
    
    const activity={
        adminId: req.user._id,
        name: req.user.name,
        email: req.user.email,
        username: req.user.username,
        action: 'create',
        category: req.body.category,
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

export const getProducts = catchAsyncError(async (req:any, res, next) => {
    
   const {productsPerPage='20', page = '1', status = 'published', category = [], mediaType = [], searchTerm = '',tags } = req.query;

    let user:TAdmin | null = null;
    if('user' in req){
        user=  req.user as TAdmin;
    };
    console.log(user,"user");

    

    const queryObject:any = {};

    if(status){
        queryObject.status=status;
    }
    if(user?.role !== "superadmin"){
        console.log("false");
        queryObject.createdBy = user?._id;
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

    if (req.user.role !== 'superadmin') {
        queryObject.createdBy = req.user._id;
    }

    console.log("queryObject",queryObject);
    
    const p = Number(page) || 1;
    const limit = Number(productsPerPage);
    const skip = (p - 1) * Number(limit);
    
  let products = await Product.find(queryObject).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const totalData = await Product.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalData / limit);
    
    res.status(200).json({
        success: true,
        products,
        totalData,
        numOfPages
    })
})

export const getProductData = catchAsyncError(async (req:any, res, next) => {
    
     
   let products = await Product.find()
     
     res.status(200).json({
         success: true,
         products,
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
    const {uuid,price,label,credit} =  req.body;

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
    if (credit) updateFields[`variants.${variantIndex}.credit`] = credit;


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

// get products by ids, for cart
export const getProductsByIds = catchAsyncError(async (req: any, res, next) => {
    try {
        const id = req.user;
        const user = await Customer.findById(id).populate('cart.product');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user.cart);
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(404).json({ message: "Not Authenticated" });
    }
});


export const buyWithCredits=catchAsyncError(async(req:any,res,next)=>{
    
    const {id}=req.user;
    const {productId}=req.params;
    const user = await Customer.findById(id);
    const product = await Product.findById(productId);


    if(!user){
        return next(new ErrorHandler("User not found", 404));
    }
    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }

    console.log("user",user);
    console.log("product",product);

    const variantIndex='0';
    const userCredits=user.subscription.credits;
    const productCredit=product.variants[variantIndex].credit || 10;
    if(!productCredit || productCredit<=0){
        return next(new ErrorHandler("Product credit not found", 404));
    }
    if(userCredits<productCredit){
        return next(new ErrorHandler("Insufficient credits", 400)); 
    }
    user.subscription.credits=userCredits-productCredit;
    user.purchasedProducts.push({productId,variantId:variantIndex});
    console.log("updated user",user);
    await user.save();
    res.send({success:true,user,message:"purchased successfully"});
});
    
export const getPurchasedProducts = catchAsyncError(async (req: any, res, next) => {
   try
   {
        const {id}=req.user;
        const customer = await Customer.findById(id).populate("purchasedProducts.productId");

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Return the list of purchased products
    res.send({
      success: true,
      purchasedProducts: customer.purchasedProducts
    });
   }
   catch(err){
    console.log(err);
   }
   
});