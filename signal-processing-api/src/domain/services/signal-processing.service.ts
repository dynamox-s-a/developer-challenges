export class SignalProcessingService {
  /**
   * Calculates Root Mean Square (RMS) of an array of numbers.
   * Formula: sqrt(sum(x_i^2) / N)
   */
  public calculateRms(values: number[]): number {
    if (values.length === 0) return 0;
    const sumOfSquares = values.reduce((sum, val) => sum + val * val, 0);
    return Math.sqrt(sumOfSquares / values.length);
  }

  /**
   * Calculates Kurtosis of an array of numbers.
   * Formula: (sum((x_i - μ)^4) / N) / σ^4
   */
  public calculateKurtosis(values: number[]): number {
    if (values.length === 0) return 0;
    const n = values.length;
    const mean = values.reduce((sum, val) => sum + val, 0) / n;
    
    let m4 = 0;
    let m2 = 0;
    
    for (const val of values) {
      const diff = val - mean;
      m2 += diff * diff;
      m4 += Math.pow(diff, 4);
    }
    
    const variance = m2 / n;
    if (variance === 0) return 0; // Avoid division by zero
    
    return (m4 / n) / Math.pow(variance, 2);
  }

  /**
   * Calculates Skewness of an array of numbers.
   * Formula: (sum((x_i - μ)^3) / N) / σ^3
   */
  public calculateSkewness(values: number[]): number {
    if (values.length === 0) return 0;
    const n = values.length;
    const mean = values.reduce((sum, val) => sum + val, 0) / n;
    
    let m3 = 0;
    let m2 = 0;
    
    for (const val of values) {
      const diff = val - mean;
      m2 += diff * diff;
      m3 += Math.pow(diff, 3);
    }
    
    const variance = m2 / n;
    if (variance === 0) return 0; // Avoid division by zero
    
    return (m3 / n) / Math.pow(variance, 1.5);
  }

  /**
   * Finds the maximum value in an array of numbers.
   */
  public calculateMax(values: number[]): number {
    if (values.length === 0) return 0;
    return Math.max(...values);
  }
}
