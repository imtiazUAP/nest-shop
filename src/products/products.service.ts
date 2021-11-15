import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Product } from "./product.model";

@Injectable()
export class ProductsService {

    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {}

    async insertProduct(title: string, desc: string, price: number) {
        const newProduct = new this.productModel({title: title, description: desc, price: price});
        const result = await newProduct.save();
        return result.id as string;
    }

    async getProducts() {
        const results = await this.productModel.find();
        const products =  results.map(result => ({
            id : result.id,
            title : result.title,
            desc : result.description,
            price: result.price
        }));
        const resultCount = await this.productModel.find().count();
        
        return {
            count: resultCount,
            result: products
        }
    }

    async getSingleProduct(productId: string) {
        const product = await this.findProduct(productId);

        return {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
          };
    }

    async updateProduct(productId: string, title: string, desc: string, price: number) {
        const updatedProduct = await this.findProduct(productId);
        // const updatedProduct = {...product};
        if (title) {
            updatedProduct.title = title;
        }
        if (desc){
            updatedProduct.description = desc;
        }
        if (price){
            updatedProduct.price = price;
        }
        const result = updatedProduct.save();
        return result;


    }

    private async findProduct(id: string): Promise<Product>{
        let singleProduct;
        try {
            singleProduct = await this.productModel.findById(id);
        } catch(error){
            throw new NotFoundException('Could not find a product');
        }
        if (!singleProduct) {
            throw new NotFoundException('Could not find product');
        }
        return singleProduct;
    }

    async deleteProduct(prodId: string) {
        let deleted;
        try {
            deleted = await this.productModel.deleteOne({_id: prodId}).exec();
        } catch(error){
            throw new NotFoundException('Could not find a product');
        }
        if (deleted.deletedCount === 0) {
        throw new NotFoundException('Could not find product.');
        }
    }
}