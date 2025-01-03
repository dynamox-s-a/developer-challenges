import Machine from '../models/machine';

export const createMachine = async (req: any, res: any) => {
  const { name, type } = req.body;

  const newMachine = new Machine({ name, type });
  await newMachine.save();

  res.status(201).json(newMachine);
};
export const updateMachine = async (req: any, res: any) => {
  const { id } = req.params;
  const { name, type } = req.body;

  const machine = await Machine.findByIdAndUpdate(id, { name, type }, { new: true });
  if (!machine) return res.status(404).json({ message: 'Máquina não encontrada' });

  res.json(machine);
};

export const deleteMachine = async (req: any, res: any) => {
  const { id } = req.params;
  const machine = await Machine.findByIdAndDelete(id);
  if (!machine) return res.status(404).json({ message: 'Máquina não encontrada' });

  res.json({ message: 'Máquina excluída com sucesso' });
};
