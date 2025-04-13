import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postSensor } from '../redux/actions/monitoringActions';
import { AppDispatch, RootState } from '../redux/store'; 
import { Machine } from '../types';

interface SensorFormProps {
  monitoringPointId: string;
  onClose: () => void;
}

export default function SensorForm ({ monitoringPointId, onClose }: SensorFormProps) {
  const [model, setModel] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const machines = useSelector((state: RootState) => state.machines);
  const machine = machines.find((machine: Machine) => machine.id === monitoringPointId);
  
  const handleSubmit = () => {
    if (model) {
      dispatch(postSensor(model, monitoringPointId));
      onClose(); 
    }
  };

  return (
    <div className="p-4 border rounded">
      <h4>Associar Sensor</h4>
      {machine && machine.type !== "Pump" ? 
      <select value={model} onChange={(e) => setModel(e.target.value)}>
      <option value="">Selecione um modelo</option>
      <option value="HF+">HF+</option>
      <option value="TcAg">TcAg</option>
      <option value="TcAs">TcAs</option>
    </select> : 
      <select value={model} onChange={(e) => setModel(e.target.value)}>
        <option value="">Selecione um modelo</option>
        <option value="HF+">HF+</option>
      </select>
      }
      <button onClick={handleSubmit}>Confirmar</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
};
