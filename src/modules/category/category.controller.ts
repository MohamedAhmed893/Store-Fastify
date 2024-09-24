import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../database/dbConnections";
import { AppError } from "../../utils/AppError";
import { MultipartFile } from '@fastify/multipart';
import path from "path";
import { handleFileUpload } from "../../utils/uploadFile";



const addCategory = async (request: FastifyRequest, reply: FastifyReply) => {
  const parts = request.parts();

  let name: string | undefined;
  let parentId: string | undefined;
  let pictureName: string | undefined;

  for await (const part of parts) {
    if (part.type === 'file') {
      const file = part as MultipartFile;
      pictureName = await handleFileUpload(file, path.join(__dirname, '../../../uploads/category'));
    } else {
      if (part.fieldname === 'name') {
        name = part.value as string;
      } else if (part.fieldname === 'parentId') {
        parentId = part.value as string;
      }
    }
  }

  if (!name) {
    return reply.status(400).send({ message: 'Name is required.' });
  }

  let parentIdNumber: number | null = null; 
  if (parentId) {
    parentIdNumber = parseInt(parentId, 10);
    if (isNaN(parentIdNumber)) {
      return reply.status(400).send({ message: 'Invalid parentId provided.' });
    }
  }

  const newCategory = await prisma.category.create({
    data: {
      name,
      parentId: parentIdNumber, 
      picture: pictureName,
    },
  });

  reply.send({ message: 'Category added successfully', category: newCategory });
};


const getAllCategory =async (request:FastifyRequest,reply:FastifyReply)=>{
    const Categories = await prisma.category.findMany()
    reply.send({message:"Success",Categories})
}


const getCategoriesTreeWithProductCount = async (request: FastifyRequest, reply: FastifyReply) => {
  
  const countProductsRecursive = async (categoryId: number): Promise<number> => {

    const productsCount = await prisma.product.count({
      where: { category_id: categoryId },
    });


    const children = await prisma.category.findMany({
      where: { parentId: categoryId },
    });

    let totalProductCount = productsCount;

  
    for (const child of children) {
      totalProductCount += await countProductsRecursive(child.id);
    }

    return totalProductCount;
  };
  const getChildren = async (parentId: number): Promise<any[]> => {
    const children = await prisma.category.findMany({
      where: { parentId },
    });

    return Promise.all(children.map(async (child) => {
      const productCount = await countProductsRecursive(child.id);
      return {
        id: child.id,
        name: child.name,
        parentId: child.parentId,
        productCount, 
        children: await getChildren(child.id), 
      };
    }));
  };
  const categories = await prisma.category.findMany({
    where: {
      parentId: null,
    },
  });
  const categoriesWithProductCount = await Promise.all(categories.map(async (category) => {
    const productCount = await countProductsRecursive(category.id);
    
    return {
      id: category.id,
      name: category.name,
      parentId: category.parentId,
      productCount, 
      children: await getChildren(category.id), 
    };
  }));
  reply.send({
    message: 'Success',
    categories: categoriesWithProductCount,
  });
};








const getCategoryById =async (request:FastifyRequest<{Params: { id: string }}>,reply:FastifyReply)=>{
    let id = request.params.id
    const Category = await prisma.category.findUnique({where:{id:Number(id)},include:{products:true}})
    if(!Category) throw new AppError("Category Not Found",403)
        reply.send({message:"Success",Category})
}
const updateCategory =async (request:FastifyRequest<{Params: { id: string };  Body: {name:string} }>,reply:FastifyReply)=>{
    const {id} = request.params
    const Category = await prisma.category.findUnique({where:{id:Number(id)}})
    if(!Category) throw new AppError("Category Not Found",403)
    const newUpdate = await prisma.category.update({
        where:{id:Number(id)} ,
        data:request.body
    })
        reply.send({message:"Success",Category:newUpdate})
}
const deleteCategory =async (request:FastifyRequest<{Params: { id: string }}>,reply:FastifyReply)=>{
    const {id} = request.params
    const Category = await prisma.category.findUnique({where:{id:Number(id)}})
    if(!Category) throw new AppError("Category Not Found",403)
    const deletedCategory = await prisma.category.delete({
        where:{id:Number(id)} 
    })
        reply.send({message:"Success",Category:deletedCategory})
}
export {
    addCategory ,
    getAllCategory ,
    updateCategory ,
    getCategoryById ,
    deleteCategory ,
    getCategoriesTreeWithProductCount
}


