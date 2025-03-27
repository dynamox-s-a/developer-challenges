import UserRepository from "../db/models/userModel";
import { Request, Response } from 'express'

async function findAll(req: Request, res: Response) {
  const users = await UserRepository.findAll();
  res.json(users);
}

function findUser(req: Request, res: Response) {
    UserRepository.findByPk(req.params.id).then((result) => res.json(result));
}

function findByLogin(req: Request, res: Response) {
    UserRepository.findOne({
        where: {
            email: req.params.email
        }
    }).then((result) => {
        if(result === null) {
            return res.status(400).json(result);
        }else {
            const password = result.get('password');
            if(password !== req.params.password){
                return res.status(401).json(result);
            }else {
                return res.json(result)
            }
        }
    });
}

function addUser(req: Request, res: Response) {
    console.log(req.body);
    UserRepository.create({
        email: req.body.email,
        password: req.body.password,
    }).then((result) => res.json(result));
}

async function updateUser(req: Request, res: Response) {
    await UserRepository.update(
    {
        email: req.body.email,
        password: req.body.password,
    },
    {
        where: {
        id: req.params.id,
        },
    }
    );

    UserRepository.findByPk(req.params.id).then((result) => res.json(result));
}

async function deleteUser(req: Request, res: Response) {
    await UserRepository.destroy({
    where: {
        id: req.params.id,
    },
    });

    UserRepository.findAll().then((result) => res.json(result));
}

export default { findAll, findUser, addUser, updateUser, deleteUser, findByLogin };
