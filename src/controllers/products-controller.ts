// // MVC - MODEL / VIEW / CONTROLLER
// import { Request, Response } from "express"
// import { prisma } from "../../prisma/prisma"

// export class ProductsController {

//     async findAll(request: Request, response: Response) {
//         try {
//             const products = await prisma.product.findMany()
//             response.send(products)
//         } catch (error) {
//             response.status(500).send(error)
//         }
//     }

//     async create(request: Request, response: Response) {
//         const { id, name, price, discount, description, color_id, category_id, size_id, highlight } = request.body

//         const productExistentInDatabase = await prisma.product.findUnique({
//             where: {
//                 id
//             }
//         })

//         if (productExistentInDatabase) return response.status(409).send({ message: 'Produto já cadastrado no sistema.' })

//         const product = await prisma.product.create({
//             data: {
//                 name,
//                 price,
//                 discount,
//                 description,
//                 created_at: new Date(),
//                 updated_at: new Date(),
//                 color_id,
//                 category_id,
//                 size_id,
//                 highlight
//             }
//         })
        
//         return product
//     }

//     async update() {

//     }

//     async destroy() {

//     }
// }