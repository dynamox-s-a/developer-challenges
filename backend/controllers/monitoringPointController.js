const { validationResult, body } = require('express-validator');
const MonitorintPoint = require('../monitoringPoint');

//Function called in the path that gets all Machines associated with a especific User
exports.getMonitoringPointFromUser = (req, res) => {
    const { _userId } = req.params;

    MonitorintPoint.find({ _userId })
            .then(monitoringPoints => {
                if (monitoringPoints.length === 0) {
                    return res.status(404).json({message: 'Nenhum ponto de monitoramento encontrado para este usuário.'});
                }
                res.json(monitoringPoints);
            })
            .catch(error => {
                res.status(500).send('Erro ao buscar pontos de monitoramento.');
            })
};

//Function called in the path that creates a new Machine
exports.createMonitoringPoint = [
    //Required parameters entries validation using express-validator
    body('userId').notEmpty().withMessage('O id do usuário é obrigatório.'),
    body('name').notEmpty().withMessage('O nome é obrigatório.'),
    body('sensorName').notEmpty().withMessage('A nome do sensor é obrigatório.'),
    body('machineName').notEmpty().withMessage('O nome da máquina é obrigatório.'),
    body('machineType').notEmpty().withMessage('O tipo da máquina é obrigatório.'),
    body('machineId').notEmpty().withMessage('O id da máquina é obrigatório.'),

    body('sensorName').custom((value) => {
        const allowedTypes = ['TcAg', 'TcAs', 'HF+'];
        if(!allowedTypes.includes(value)) {
            throw new Error('Sensor inválido.');
        }
        return true;
    }),

    (req, res) => {
        //Validation errors verification
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId, name, sensorName, machineName, machineType, machineId } = req.body;

        const monitoringPoint = new MonitorintPoint({
            _userId: userId,
            _machineId: machineId,
            _machineName: machineName,
            _machineType: machineType,
            name,
            sensorName
        });
    
        monitoringPoint.save()
            .then(() => {
                res.status(201).send('Ponto de monitoramento criado com sucesso.');
            })
            .catch((error) => {
                res.status(500).send('Erro ao criar ponto de monitoramento.')
            });;
    }
];

exports.deleteMonitoringPoint = (req, res) => {
    const { id } = req.params;

    MonitorintPoint.findByIdAndDelete(id)
            .then(monitoringPoint => {
                if(!monitoringPoint) {
                    return res.status(404).json({message: 'Ponto de monitoramento não encontrada.'});
                }
                res.json({ message: 'Ponto de monitoramento excluida com sucesso.' });
            })
            .catch(error => {
                res.status(500).send("Erro ao excluir a ponto de monitoramento.");
            });
};