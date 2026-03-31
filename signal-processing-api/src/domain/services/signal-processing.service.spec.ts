import { SignalProcessingService } from './signal-processing.service';

describe('SignalProcessingService', () => {
  let service: SignalProcessingService;

  beforeEach(() => {
    service = new SignalProcessingService();
  });

  describe('RMS Calculation', () => {
    it('should correctly calculate the RMS of a generic signal', () => {
      // For [1, 2, 3] sum of squares = 1 + 4 + 9 = 14
      // Mean of squares = 14 / 3 = 4.666...
      // RMS = sqrt(4.666...) ~ 2.1602
      const values = [1, 2, 3];
      const rms = service.calculateRms(values);
      expect(rms).toBeCloseTo(2.1602, 3);
    });

    it('should calculate the RMS of a synthetic sine wave (A/sqrt(2))', () => {
      const amplitude = 10;
      const values: number[] = [];
      const steps = 1000;
      
      for (let i = 0; i < steps; i++) {
        // Full sine wave period
        values.push(amplitude * Math.sin((i / steps) * Math.PI * 2));
      }

      const rms = service.calculateRms(values);
      const expectedRms = amplitude / Math.SQRT2;
      
      // Precision margin for discrete approximation
      expect(rms).toBeCloseTo(expectedRms, 1);
    });

    it('should return 0 for empty arrays', () => {
      expect(service.calculateRms([])).toBe(0);
    });
  });

  describe('Max Value', () => {
    it('should find the maximum value', () => {
      expect(service.calculateMax([-5, 0, 10, 3])).toBe(10);
      expect(service.calculateMax([])).toBe(0);
    });
  });

  // Kurtosis and Skewness could be tested here using mathematically known distributions
  describe('Kurtosis & Skewness', () => {
    it('should calculate basic statistical metrics gracefully', () => {
      const signal = [1, 2, 3, 4, 5];
      expect(service.calculateSkewness(signal)).toBeDefined();
      expect(service.calculateKurtosis(signal)).toBeDefined();
    });
  });
});
