import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { title } from "process";

import { Product } from "./product.model";

@Injectable()
export class ProductsService {
    private products: Product[] = [];

    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {}

    async insertProduct(title: string, desc: string, price: number) {
        const newProduct = new this.productModel({title: title, description: desc, price: price});
        const result = await newProduct.save();
        return result.id as string;
    }

    async getProducts() {
        const results = await this.productModel.find();
        return results.map(result => ({
            id : result.id,
            title : result.title,
            desc : result.description,
            price: result.price
        }));
    }

    getSingleProduct(productId: string) {
        const product = this.findProduct(productId);


        return product;
    }

    async updateProduct(productId: string, title: string, desc: string, price: number) {
        const updatedProduct = await this.findProduct(productId);
        // const updatedProduct = {...product};
        if (title) {
            updatedProduct.title = title;
        }
        if (desc){
            updatedProduct.desc = desc;
        }
        if (price){
            updatedProduct.price = price;
        }
        const result = updatedProduct.save();
        return result;


    }

    private findProduct(id: string):any{
        const singleProduct = this.productModel.findById(id);
        if (!singleProduct) {
            throw new NotFoundException('Could not find product');
        }
        return singleProduct;
        // const productIndex = this.products.findIndex((prod) => prod.id === id);
        // const product = this.products[productIndex];
        // if (!product) {
        //     throw new NotFoundException('Could not find product');
        // }

        // return [product, productIndex];
    }

    async deleteProduct(prodId: string) {
        const deleted = await this.productModel.deleteOne({_id: prodId});
        return deleted;
    }
}