
import {FastifyInstance} from 'fastify'

import { addCategory, deleteCategory, getAllCategory, getCategoryById, updateCategory } from './category.controller'


export const catergoryRouter =async (app:FastifyInstance)=>{

  app.post('/categories', { preHandler: addCategory }, async (request, reply) => {
  
    reply.send({ message: "Category added successfully" });
  });

  app.get('/categories',getAllCategory)
  app.get('/categories/:id',getCategoryById)
  app.put('/categories/:id',updateCategory)
  app.delete('/categories/:id',deleteCategory)
}