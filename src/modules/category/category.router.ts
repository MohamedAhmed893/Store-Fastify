
import {FastifyInstance} from 'fastify'

import { addCategory, deleteCategory, getAllCategory, getCategoriesTreeWithProductCount, getCategoryById, updateCategory } from './category.controller'


export const catergoryRouter =async (app:FastifyInstance)=>{

  app.post('/categories', addCategory);
  app.get('/categories',getAllCategory)
  app.get('/categories/tree',getCategoriesTreeWithProductCount)
  app.get('/categories/:id',getCategoryById)
  app.put('/categories/:id',updateCategory)
  app.delete('/categories/:id',deleteCategory)
}