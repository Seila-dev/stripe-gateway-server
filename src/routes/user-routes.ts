import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "../controllers/user-controller";

const UsersRoutes = Router()

UsersRoutes.get(
    '/',
    new UserController().getAll
)

UsersRoutes.post(
    '/',
    new UserController().save   
)

UsersRoutes.get(
    '/:id',
    new UserController().getById   
)

export default UsersRoutes