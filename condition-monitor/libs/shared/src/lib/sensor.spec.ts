import { allowedSensorModels, isSensorModel, isSensorModelAllowed } from './sensor.js';

describe('sensor model rule', () => {
  it('allows only HF+ on a pump', () => {
    expect(allowedSensorModels('Pump')).toEqual(['HF+']);
    expect(isSensorModelAllowed('Pump', 'HF+')).toBe(true);
  });

  it('rejects TcAg and TcAs on a pump', () => {
    expect(isSensorModelAllowed('Pump', 'TcAg')).toBe(false);
    expect(isSensorModelAllowed('Pump', 'TcAs')).toBe(false);
  });

  it('allows every model on a fan', () => {
    expect(allowedSensorModels('Fan')).toEqual(['TcAg', 'TcAs', 'HF+']);
  });

  it('recognises only the three challenge models', () => {
    expect(isSensorModel('HF+')).toBe(true);
    expect(isSensorModel('HF')).toBe(false);
    expect(isSensorModel('hf+')).toBe(false);
  });
});
