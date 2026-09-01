/**
 * Unitários do janelamento: fórmula explícita do RMS, política única de arredondamento
 * e timestamps determinísticos alinhados à grade de 1 s.
 */
import { generateStream } from './signal';
import { getScenarioConfig } from './scenarios';
import { round6, windowStream } from './windows';

describe('janelas de 1 s sobre o stream de 128 Hz', () => {
  const stream = generateStream(getScenarioConfig('normal'));
  const windows = windowStream(stream);

  it('produz exatamente 60 janelas com 60 leituras de cada grandeza', () => {
    expect(windows.windowTimestamps).toHaveLength(60);
    expect(windows.rmsG.x).toHaveLength(60);
    expect(windows.rmsG.y).toHaveLength(60);
    expect(windows.rmsG.z).toHaveLength(60);
    expect(windows.temperaturesC).toHaveLength(60);
    expect(windows.rpms).toHaveLength(60);
  });

  it('o RMS da primeira janela bate com a fórmula explícita sqrt(Σx²/N) sobre 128 amostras', () => {
    const firstWindow = stream.frames.slice(0, 128).map((f) => f.ayG);
    expect(firstWindow).toHaveLength(128);
    const manual = Math.sqrt(firstWindow.reduce((sum, v) => sum + v * v, 0) / 128);
    expect(windows.rmsG.y[0]).toBe(round6(manual));
  });

  it('timestamps começam na base do cenário e avançam exatamente 1000 ms por janela', () => {
    expect(windows.windowTimestamps[0]).toBe(stream.config.baseTimestamp);
    for (let i = 1; i < windows.windowTimestamps.length; i += 1) {
      const delta =
        Date.parse(windows.windowTimestamps[i]) - Date.parse(windows.windowTimestamps[i - 1]);
      expect(delta).toBe(1000);
    }
    // Formato canônico UTC com milissegundos, como o contrato exige.
    for (const timestamp of windows.windowTimestamps) {
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    }
  });

  it('todos os valores saem arredondados a 6 casas, uma única vez', () => {
    const all = [
      ...windows.rmsG.x,
      ...windows.rmsG.y,
      ...windows.rmsG.z,
      ...windows.temperaturesC,
      ...windows.rpms,
    ];
    for (const value of all) {
      expect(Number.isFinite(value)).toBe(true);
      expect(value).toBe(round6(value));
    }
  });
});
