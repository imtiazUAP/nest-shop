import { Controller, Post, Body, Get, Param, Patch, Delete} from "@nestjs/common";
import { stringify } from "querystring";

import { ProductsService } from "./products.service";

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    async addProduct(
        //This is alternative way to describe all at once
        //@Body() completeBody: {title: string, description: string, price: number}
        @Body('title') prodTitle: string,
        @Body('description') prodDesc: string,
        @Body('price') prodPrice: number,
        ) {
        const generatedId = await this.productsService.insertProduct(
            prodTitle,
            prodDesc,
            prodPrice,
        );
        return { id: generatedId };
    }

    @Get()
    async getAllProducts() {
        return await this.productsService.getProducts();
    }

    @Get(':id')
    async getProduct(@Param('id') prodId: string) {
        return await this.productsService.getSingleProduct(prodId);
    }

    @Patch(':id')
    async updateProduct(
        @Param('id') prodId: string,
        @Body('title') prodTitle: string,
        @Body('description') prodDesc: string,
        @Body('price') prodPrice: number,
    ) {
        return await this.productsService.updateProduct(prodId, prodTitle, prodDesc, prodPrice);


    }

    @Delete(':id')
    async removeProduct(@Param('id') prodId: string) {
        return await this.productsService.deleteProduct(prodId);
    }
}