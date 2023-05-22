const { validationResult, body } = require('express-validator');
const Machine = require('../machine');

//Function called in the path that gets all Machines associated with a especific User
exports.getMachineFromUser = (req, res) => {
    const { _userId } = req.params;

    Machine.find({ _userId })
            .then(machines => {
                if (machines.length === 0) {
                    return res.status(404).json({message: 'Nenhuma máquina encontrada para este usuário.'});
                }
                res.json(machines);
            })
            .catch(error => {
                res.status(500).send('Erro ao buscar máquinas.');
            })
}

//Function called in the path that creates a new Machine
exports.createMachine = [
    //Required parameters entries validation using express-validator
    body('userId').notEmpty().withMessage('O id do usuário é obrigatório.'),
    body('name').notEmpty().withMessage('O nome é obrigatório.'),
    body('type').notEmpty().withMessage('A tipo é obrigatório.'),

    body('type').custom((value) => {
        const allowedTypes = ['Pump', 'Fan'];
        if(!allowedTypes.includes(value)) {
            throw new Error('Tipo inválido.');
        }
        return true;
    }),

    (req, res) => {
        //Validation errors verification
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId, name, type } = req.body;

        const machine = new Machine({
            _userId: userId,
            name,
            type
        });
    
        machine.save()
            .then(() => {
                res.status(201).send('Máquina criada com sucesso.');
            })
            .catch((error) => {
                res.status(500).send('Erro ao criar máquina.')
            });;
    }
];

exports.updateMachine = [
    //Required parameters entries validation using express-validator
    body('userId').notEmpty().withMessage('O id do usuário é obrigatório.'),
    body('name').notEmpty().withMessage('O nome é obrigatório.'),
    body('type').notEmpty().withMessage('A tipo é obrigatório.'),

    body('type').custom((value) => {
        const allowedTypes = ['Pump', 'Fan'];
        if(!allowedTypes.includes(value)) {
            throw new Error('Tipo inválido.');
        }
        return true;
    }),

    (req, res) => {
        const { id } = req.params;
        const { userId, name, type } = req.body;

        Machine.findByIdAndUpdate(id, { _userId: userId, name, type }, { new: true })
                .then(machine => {
                    if(!machine) {
                        return res.status(404).json({ message: 'Máquina não encontrada.' });
                    }
                    res.json(machine);;
                })
                .catch(error => {
                    res.status(500).send('Erro ao atualizar máquina.');
                })
    }
]

exports.deleteMachine = (req, res) => {
    const { id } = req.params;

    Machine.findByIdAndDelete(id)
            .then(machine => {
                if(!machine) {
                    return res.status(404).json({message: 'Máquina não encontrada.'});
                }
                res.json({ message: 'Máquina excluida com sucesso.' });
            })
            .catch(error => {
                res.status(500).send("Erro ao excluir a máquina.");
            });
};