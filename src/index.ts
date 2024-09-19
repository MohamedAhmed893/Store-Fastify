import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from './utils/AppError'
import { productRouter } from './modules/product/product.router'
import { catergoryRouter } from './modules/category/category.router'
import fastifyMultipart from '@fastify/multipart'


const fastify = Fastify({
    logger: true
  })

fastify.register(fastifyMultipart,{
  limits:{fieldSize:10*1024*1024}
})

fastify.register(productRouter)
fastify.register(catergoryRouter)

fastify.all('*',async (request:FastifyRequest, reply:FastifyReply)=>{
  throw new AppError('This Page Not Found '+request.originalUrl, 404)

})

//global error
  fastify.setErrorHandler(function (error, request:FastifyRequest, reply:FastifyReply) {
    let code =error.statusCode || 500
   reply.status(code).send({Error:error.message ,statusCode:error.statusCode})
  })
  fastify.listen({ port: 3000 }, (err, address) => {
    if (err) return  console.error(err)
        console.log(`server listening on ${address}`)

    // Server is now listening on ${address}
  })