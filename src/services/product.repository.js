import ProductDTO from "../DAO/DTO/product.dto.js";

export default class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }
    addProduct = async(product) => {
        const newProduct = new ProductDTO(product)
        return await this.dao.addProduct(newProduct)
    }
    getAllProducts = async() => {
        return await this.dao.getAllProducts();  
    }
    getProductById = async (pid) => {
        return await this.dao.getProductById(pid)
    }
    updateProduct = async (pid, resolve) => {
        const product = this.getProductById(pid)
        product.status = resolve
        return await this.dao.updateProduct(pid, resolve)
    }
    deleteProduct = async(pid) => {
        return await this.dao.deleteProduct(pid)
    }
    /* getProductsPaginate = async() => {
        return await this.dao.getProductsPaginate()
    } */
}
