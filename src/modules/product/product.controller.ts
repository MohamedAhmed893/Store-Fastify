import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../database/dbConnections";
import { AppError } from "../../utils/AppError";
import {MultipartFile} from '@fastify/multipart'
import path from "path";
import { handleFileUpload } from "../../utils/uploadFile";

interface ProductData {
    name:string ;
    category_id:number ;
    picture?:string
}
const addProduct = async (request: FastifyRequest, reply: FastifyReply) => {
    
      const parts = request.parts();
  
      let name: string | undefined;
      let categoryId: string | undefined;
      let pictureName: string | undefined;
  
      for await (const part of parts) {
        if (part.type === 'file') {
          const file = part as MultipartFile;
        
          pictureName = await handleFileUpload(file, path.join(__dirname, '../../../uploads/product'));
        } else {
          if (part.fieldname === 'name') {
            name = part.value as string;
          } else if (part.fieldname === 'category_id') {
            categoryId = part.value as string;
          }
        }
      }
  
      if (!name || !categoryId ) {
        return reply.status(400).send({ message: 'Name, category_id are required.' });
      }
  
      const categoryIdNumber = parseInt(categoryId, 10);
      if (isNaN(categoryIdNumber)) {
        return reply.status(400).send({ message: 'Invalid category_id provided.' });
      }
  
      const newProduct = await prisma.product.create({
        data: {
          name: name,
          category_id: categoryIdNumber,
          picture: pictureName,
        },
      });
  
      reply.send({ message: 'Product added successfully', product: newProduct });
   
  };

const getAllProduct =async (request:FastifyRequest,reply:FastifyReply)=>{
    const products = await prisma.product.findMany()
    reply.send({message:"Success",products})
}

const getProductById =async (request:FastifyRequest<{Params: { id: string }}>,reply:FastifyReply)=>{
    let id = request.params.id
    const product = await prisma.product.findUnique({where:{id:Number(id)}})
    if(!product) throw new AppError("Product Not Found",403)
        reply.send({message:"Success",product})
}
const updateProduct =async (request:FastifyRequest<{Params: { id: string };  Body: ProductData }>,reply:FastifyReply)=>{
    const {id} = request.params
    const product = await prisma.product.findUnique({where:{id:Number(id)}})
    if(!product) throw new AppError("Product Not Found",403)
    const newUpdate = await prisma.product.update({
        where:{id:Number(id)} ,
        data:request.body
    })
        reply.send({message:"Success",product:newUpdate})
}
const deleteProduct =async (request:FastifyRequest<{Params: { id: string }}>,reply:FastifyReply)=>{
    const {id} = request.params
    const product = await prisma.product.findUnique({where:{id:Number(id)}})
    if(!product) throw new AppError("Product Not Found",403)
    const deletedProduct = await prisma.product.delete({
        where:{id:Number(id)} 
    })
        reply.send({message:"Success",product:deletedProduct})
}
export {
    addProduct ,
    getAllProduct ,
    getProductById ,
    updateProduct  ,
    deleteProduct
}


