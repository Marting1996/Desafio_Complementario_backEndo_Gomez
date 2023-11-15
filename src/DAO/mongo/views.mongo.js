import productModel from "./models/product.mongo.model.js";

export default class ViewsMongo {
    /* getProductsPaginate = async(limit, page, sort, category) => {
        const filterCategory = category ? { category } : {};
        try {
            const products = await productModel.paginate(filterCategory, {
                page,
                limit,
                sort:{price: sort},
                lean: true,
            })
            products.nextLink = products.hasNextPage ? `/?page=${products.nextPage}&limit=${limit}&sort=${sort}` : "";
            products.prevLink = products.hasPrevPage ? `/?page=${products.prevPage}&limit=${limit}&sort=${sort}` : "";
            products.nextPagee = products.hasNextPage ? `/?page=${products.nextPage}&limit=${limit}&sort=${sort}` : "";
            products.prevPagee = products.hasPrevPage ? `/?page=${products.prevPage}&limit=${limit}&sort=${sort}` : "";
            return products
        
        } catch (error) {
            throw error
        }
    } */
    getAllProducts = async () => {
        try {
            return await productModel.find().lean().exec()
        } catch (error) {
            return { message: "Error al obtener los productos" }
        }
    }

    getProductDetail = async(id) => {
        try {
            const product = await productModel.findById(id).lean().exec();
            return product
        } catch (error) {
            
        }
    }

    getAllProducts = async () => {
        try {
            const products = await productModel.find().lean().exec();
            return products
        } catch (error) {
            
        }
    }
}