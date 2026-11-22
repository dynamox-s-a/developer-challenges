import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AxiosError, type AxiosResponse } from 'axios';
import { Provider } from 'react-redux';
import { setupStore } from '../../app/store';
import { api } from '../../lib/api-client';
import type { MonitoringPoint } from './monitoring-points.slice';
import { SensorDialog } from './sensor-dialog';

// Um ponto de bomba que já tem sensor e um de ventilador sem sensor
const pumpPoint: MonitoringPoint = {
  id: 'point-1',
  name: 'Mancal LA',
  machine: { id: 'machine-1', name: 'Bomba 01', type: 'Pump' },
  sensor: { id: 'sensor-1', model: 'HF+', serialNumber: 'DyL4.01.A0001' },
};
const fanPoint: MonitoringPoint = {
  id: 'point-2',
  name: 'Motor',
  machine: { id: 'machine-2', name: 'Ventilador 01', type: 'Fan' },
  sensor: null,
};

// Abre o diálogo para um ponto. Devolve o "espião" que faz o papel da página
function renderDialog(point: MonitoringPoint) {
  const onSaved = vi.fn();

  render(
    <Provider store={setupStore()}>
      <SensorDialog point={point} onClose={vi.fn()} onSaved={onSaved} />
    </Provider>,
  );

  return { onSaved };
}

// O "select" do MUI abre com mouseDown e mostra as opções numa lista
function openModelOptions() {
  fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Modelo' }));
}

// O MUI marca a opção desabilitada com aria-disabled="true"
function isDisabled(model: string) {
  const option = screen.getByRole('option', { name: model });
  return option.getAttribute('aria-disabled') === 'true';
}

describe('SensorDialog', () => {
  afterEach(() => vi.restoreAllMocks());

  it('should show the field errors and not call the api when the form is invalid', () => {
    const put = vi.spyOn(api, 'put');
    renderDialog(fanPoint);

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(screen.getByText('Modelo de sensor inválido')).toBeTruthy();
    expect(screen.getByText('Informe o número de série')).toBeTruthy();
    expect(put).not.toHaveBeenCalled();
  });

  it('should not offer TcAg and TcAs on a pump', () => {
    renderDialog(pumpPoint);

    expect(
      screen.getByText('Máquinas do tipo Pump não aceitam TcAg e TcAs'),
    ).toBeTruthy();
    openModelOptions();
    expect(isDisabled('TcAg')).toBe(true);
    expect(isDisabled('TcAs')).toBe(true);
    expect(isDisabled('HF+')).toBe(false);
  });

  it('should save the sensor with the serial number in the standard format', async () => {
    vi.spyOn(api, 'put').mockResolvedValue({
      data: { id: 'sensor-2', model: 'TcAg', serialNumber: 'DyL1.01.A0001' },
    });
    const { onSaved } = renderDialog(fanPoint);

    // Num ventilador, todos os modelos podem ser escolhidos
    openModelOptions();
    expect(isDisabled('TcAg')).toBe(false);
    fireEvent.click(screen.getByRole('option', { name: 'TcAg' }));
    // O exemplo acompanha o modelo escolhido
    expect(screen.getByText('Ex.: DyL1.01.A0000')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Número de série'), {
      target: { value: 'dyl1.01.a0001' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => expect(onSaved).toHaveBeenCalledWith('Sensor salvo'));
    expect(api.put).toHaveBeenCalledWith('/monitoring-points/point-2/sensor', {
      model: 'TcAg',
      serialNumber: 'DyL1.01.A0001',
    });
  });

  it('should start with the current sensor and remove it', async () => {
    vi.spyOn(api, 'delete').mockResolvedValue({ data: '' });
    const { onSaved } = renderDialog(pumpPoint);

    expect(screen.getByDisplayValue('DyL4.01.A0001')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Remover sensor' }));

    await waitFor(() =>
      expect(onSaved).toHaveBeenCalledWith('Sensor removido'),
    );
    expect(api.delete).toHaveBeenCalledWith(
      '/monitoring-points/point-1/sensor',
    );
  });

  it('should not offer to remove a sensor that does not exist', () => {
    renderDialog(fanPoint);

    expect(screen.queryByRole('button', { name: 'Remover sensor' })).toBeNull();
  });

  it('should show the api error and stay open', async () => {
    const error = new AxiosError('Request failed', 'ERR_BAD_REQUEST');
    error.response = {
      status: 409,
      data: {
        error: {
          code: 'SERIAL_NUMBER_IN_USE',
          message: 'O número de série DyL4.01.A0002 já está em outro sensor',
        },
      },
    } as AxiosResponse;
    vi.spyOn(api, 'put').mockRejectedValue(error);
    const { onSaved } = renderDialog(pumpPoint);

    fireEvent.change(screen.getByLabelText('Número de série'), {
      target: { value: 'DyL4.01.A0002' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(
      await screen.findByText(
        'O número de série DyL4.01.A0002 já está em outro sensor',
      ),
    ).toBeTruthy();
    expect(onSaved).not.toHaveBeenCalled();
  });
});
