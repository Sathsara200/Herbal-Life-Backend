
import Product from "../models/product.js";
import { isItAdmin } from "./userController.js";



export async function addProduct(req, res) {
    try {
        if (!isItAdmin(req)) {
            return res.status(401).json({
                message: "You are not authorized to perform this action"
            });
        }

        const data = req.body;
        const newProduct = new Product(data);

        await newProduct.save();

        res.json({
            message: "Product added successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Product addition failed"
        });
    }
}

export async function updateProduct(req,res){
    try {
        if(isItAdmin(req)){

            const key = req.params.key;

            const data = req.body

            await Product.updateOne({key:key},data)

            res.json({
                message : "Product updated successfully"
            })
            return;

        }else{
            res.status(403).json({
                message : "You are not authorized to perform this action"
            })
            return;
        }
    } catch (e) {
        res.status(500).json({
            message : "Failed to update product"
        })
    }
}

export async function deleteProduct(req,res){
    try {
        if(isItAdmin(req)){
            const key = req.params.key;
            await Product.deleteOne({key:key})
            res.json({
                message : "Product deleted successfully"
            })
        }else{
            res.status(403).json({
                message : "You are not autherized to perform this action"
            })
            return;
        }
    } catch (e) {
        res.status(500).json({
            message : "Failed to delete product"
        })
    }
}


export async function getProducts(req,res){


    try {

       if(isItAdmin(req)){
            const products = await Product.find();
            res.json(products);
            return;
        } else{
            const products = await Product.find({availability:true});
            res.json(products);
            return;
        }
        
    } catch (e) {
        res.status(500).json({
            message : "Failed to get products"
        })
    }
}


export async function getProduct(req,res){
    try{
        const key = req.params.key;
        console.log(key);
        const product = await Product.findOne({key:key})
        if(product == null){
            res.status(404).json({
                message : "Product not found"
            })
            return;
        }
        res.json(product)
        return;
    }catch(e){
        res.status(500).json({
            message : "Failed to get product"
        })
    }
}

export async function searchProducts(req, res) {
    try {
        const query = req.params.query;
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } }
            ],
            availability: true
        });
        res.json(products);
    } catch (e) {
        res.status(500).json({
            message: "Failed to search products"
        });
    }
}
