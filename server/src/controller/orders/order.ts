import catchAsyncError from "@src/middleware/catchAsyncError";
import ErrorHandler from "@src/utils/errorHandler";
import Razorpay from "razorpay";
import config from "@src/utils/config";
import Order, { ProductItem } from "@src/model/product/order";
import customer from "@src/model/user/customer";
import { TProduct } from "@src/types/product";

/*
index

order controllers
1.createOrder
2.fetchOrdersByCustomerId
3.getOrders
4.getOrderById

*/

const razorpayInstance = () => {
  return new Razorpay({
    key_id: config.razorpayKey as string,
    key_secret: config.razorpaySecret as string,
  });
};

export const createOrder = catchAsyncError(async (req: any, res, next) => {
  const razorpay = razorpayInstance();

  const { _id } = req.user;
  const user = await customer.findById(_id).populate("cart.productId");

  if (!user || !user.cart) {
    throw new Error("User not found or cart is empty.");
  }
  // console.log("user ::", user);
  let totalPrice = 0;

  // console.log("user.cart", user.cart);
  if (!user?.cart || user?.cart?.length === 0) {
    return next(new ErrorHandler("Cart is empty", 404));
  }

  user?.cart?.forEach((item) => {
    const product: any = item.productId;
    const variantId = item.variantId;
    console.log("product variants", product.variants);

    const variant = product.variants.find(
      (variant: any) => variant._id.toString() === variantId
    );
    console.log("variant", variant);
    if (variant) {
      console.log(typeof variant.price);

      totalPrice += variant.price;
    }
  });

  console.log(totalPrice, "totalPrice");

  const options = {
    amount: totalPrice * 100,
    currency: "INR",
    payment_capture: "1",
  };

  const response = await razorpay.orders.create(options);
  console.log("step2:", response);

  if (!response) {
    return next(new ErrorHandler("Error occured while creating Order", 404));
  }
  const amountString = totalPrice.toString();

  const newOrder = await Order.create({
    userId: user._id,
    razorpayOrderId: response.id,
    products: user.cart,
    totalAmount: amountString,
    currency: "INR",
    status: "pending",
    method: "razorpay",
  });

  const order = await newOrder.save();

  res.send({
    success: true,
    order_id: response.id,
    mi_order_id: order._id,
    currency: response.currency,
    amount: response.amount,
  });
});

export const fetchOrdersByCustomerId = catchAsyncError(
  async (req: any, res, next) => {
    const { id } = req.params;
    const {searchTerm,currentPage,dataPerPage}=req.query;
    console.log("searchTerm",searchTerm,currentPage,dataPerPage);

    const queryObject: any = { userId: id };
    
    if (searchTerm) {
      queryObject["$or"] = [
        { razorpayOrderId: { $regex: searchTerm, $options: "i" } },
        { method: { $regex: searchTerm, $options: "i" } },
        { status: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const skip = (currentPage - 1) * (Number(dataPerPage));

     const orders = await Order.find(queryObject)
      .populate("products.productId")
      .sort({ createdAt: -1 })
      .skip(skip).limit(Number(dataPerPage));

    const totalOrders = await Order.countDocuments(queryObject);
    const totalPages = Math.ceil(totalOrders / dataPerPage);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    res.status(200).json({ 
      orders,
      totalOrders,
      totalPages,
  });
  });
export const getOrders = catchAsyncError(async (req: any, res, next) => {
  const orders = await Order.find();

  res.status(201).json({
    success: true,
    orders: orders,
  });
});

export const getOrderById = catchAsyncError(async (req: any, res, next) => {
  const { id: orderId } = req.params;

  const order = await Order.findById(orderId).populate('products.productId');

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});
