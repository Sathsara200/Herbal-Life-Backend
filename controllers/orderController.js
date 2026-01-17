import Order from "../models/order.js";
import Product from "../models/product.js";
import { isItAdmin, isItCustomer } from "./userController.js";

export async function createOrder(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Please login" });
    }

    const { orderedItems } = req.body;

    if (!orderedItems || orderedItems.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    // Generate orderId
    const lastOrder = await Order.findOne().sort({ orderDate: -1 });
    let orderId = "ORD0001";

    if (lastOrder) {
      const num = parseInt(lastOrder.orderId.replace("ORD", ""));
      orderId = "ORD" + String(num + 1).padStart(4, "0");
    }

    let finalItems = [];
    let totalAmount = 0;

    for (const item of orderedItems) {
      const product = await Product.findOne({ key: item.key });

      if (!product) {
        return res.status(404).json({
          message: `Product with key ${item.key} not found`,
        });
      }

      if (!product.availability) {
        return res.status(400).json({
          message: `Product ${product.name} is not available`,
        });
      }

      if (!item.qty || item.qty <= 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      finalItems.push({
        product: {
          key: product.key,
          name: product.name,
          image: product.image[0],
          price: product.price,
        },
        quantity: item.qty,
      });

      totalAmount += product.price * item.qty;
    }

    const order = new Order({
      orderId,
      email: req.user.email,
      orderedItems: finalItems,
      totalAmount,
    });

    await order.save();

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create order" });
  }
}


export async function getQuote(req, res) {
  try {
    const { orderedItems } = req.body;

    if (!orderedItems || orderedItems.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    let totalAmount = 0;

    for (const item of orderedItems) {
      if (!item.qty || item.qty <= 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      const product = await Product.findOne({ key: item.key });

      if (!product) {
        return res.status(404).json({
          message: `Product with key ${item.key} not found`,
        });
      }

      if (!product.availability) {
        return res.status(400).json({
          message: `Product with key ${item.key} is not available`,
        });
      }

      totalAmount += product.price * item.qty;
    }

    res.json({
      message: "Order quotation",
      total: totalAmount,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get quotation" });
  }
}


export async function getOrders(req,res){
	if(isItCustomer(req)){
		try {
			const orders = await Order.find({email: req.user.email});
			res.json(orders);
		} catch (e) {
			res.status(500).json({error: "Failed to get orders"});
		}
	}else if(isItAdmin(req)){
		try {
			const orders = await Order.find();
			res.json(orders);
		} catch (e) {
			res.status(500).json({error: "Failed to get orders"})
		}
	}else{
		res.status(403).json({error: "Unauthorized"});
	}
}

export async function isOrderComplete(req,res){
	const orderId = req.params.orderId;
	const status = req.body.status;

	if(isItAdmin(req)){
		try {
			const order = await Order.findOne(
				{
					orderId: orderId
				}
			)
			
			if(order == null){
				res.status(404).json({error: "Order not found"});
				return
			}

			await Order.updateOne(
				{
					orderId: orderId
				},
				{
					status: status
				}
			);

			res.json({message: "Order status updated successfully"});

		} catch (e) {
			res.status(500).json({error: "Unauthorized"});
		}
	}else{
		res.status(403).json({error: "Unauthorized"});
	}
}

export async function cancelOrder(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { orderId } = req.params;

    const order = await Order.findOne({
      orderId,
      email: req.user.email,
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.isCompleted) {
      return res.status(400).json({ error: "Order already completed" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to cancel order" });
  }
}
