import {FastifyInstance} from 'fastify'
import { addProduct, deleteProduct, getAllProduct, getProductById, updateProduct } from './product.controller'

export const productRouter =async (app:FastifyInstance)=>{
    app.post('/Products',addProduct)
    app.get('/Products',getAllProduct)
    app.get('/Products/:id',getProductById)
    app.put('/Products/:id',updateProduct)
    app.delete('/Products/:id',deleteProduct)
    
}

