import {Router, Request, Response, NextFunction } from "express";
import users from '../controllers/users';
import machines from '../controllers/machines';
import monitoringPoints from '../controllers/monitoringPoints';

const routes = Router();

const authentication = (req: Request, res: Response, next: NextFunction) : void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(':')[1];
    if (token == null) res.sendStatus(401);
    else {
        return next();
    }
    //todo verify user on db
}

routes.get("/users", users.findAll);
routes.post("/users", users.addUser);
routes.get('/login/email=:email&password=:password', users.findByLogin);
routes.get("/users/:id", users.findUser);
routes.put("/users/:id", users.updateUser);
routes.delete("/users/:id", users.deleteUser);

routes.post('/machines', authentication, machines.addMachine);
routes.put('/machines', authentication, machines.updateMachine);
routes.delete('/machines/:id', authentication, machines.deleteMachine);
routes.get('/machines/:id', authentication, machines.findAll);

routes.post('/points', authentication, monitoringPoints.addMonitoringPoint);
routes.put('/points', authentication, monitoringPoints.updateMonitoringPoint);
routes.delete('/points/:id', authentication, monitoringPoints.deleteMonitoringPoint);

export { routes as default };
