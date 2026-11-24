import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AxiosError, type AxiosResponse } from 'axios';
import { Provider } from 'react-redux';
import { MAX_TIME_SERIES_SAMPLES } from '@dynapredict/shared';
import { setupStore } from '../../app/store';
import { api } from '../../lib/api-client';
import { UploadTimeSeriesDialog } from './upload-time-series-dialog';

const CSV =
  'instante,valor\n2026-11-22T10:00:00Z,31.5\n2026-11-22T10:10:00Z,32';

// Um arquivo CSV escolhido pelo usuário. O File do jsdom (o "navegador"
// dos testes) não tem o .text() dos navegadores de verdade: aqui ele é
// completado, devolvendo o conteúdo do arquivo
function csvFile(content: string) {
  const file = new File([content], 'temperatura.csv', { type: 'text/csv' });
  return Object.assign(file, { text: async () => content });
}

function renderDialog() {
  const onClose = vi.fn();
  const onUploaded = vi.fn();
  render(
    <Provider store={setupStore()}>
      <UploadTimeSeriesDialog
        pointId="point-1"
        onClose={onClose}
        onUploaded={onUploaded}
      />
    </Provider>,
  );
  return { onClose, onUploaded };
}

// Preenche o formulário. Sem "csv", não escolhe arquivo nenhum
function fill({
  name = 'Temperatura',
  unit = '°C',
  csv = CSV as string | null,
}) {
  fireEvent.change(screen.getByLabelText('Nome da série'), {
    target: { value: name },
  });
  fireEvent.change(screen.getByLabelText('Unidade (opcional)'), {
    target: { value: unit },
  });
  if (csv !== null) {
    fireEvent.change(screen.getByLabelText('Arquivo CSV'), {
      target: { files: [csvFile(csv)] },
    });
  }
}

function send() {
  fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));
}

describe('UploadTimeSeriesDialog', () => {
  afterEach(() => vi.restoreAllMocks());

  it('should send the series read from the file', async () => {
    vi.spyOn(api, 'post').mockResolvedValue({ data: { id: 'series-1' } });
    const { onUploaded } = renderDialog();

    fill({});
    // O nome do arquivo aparece embaixo do botão
    expect(screen.getByText('temperatura.csv')).toBeTruthy();
    send();

    await waitFor(() =>
      expect(onUploaded).toHaveBeenCalledWith('Série enviada'),
    );
    expect(api.post).toHaveBeenCalledWith(
      '/monitoring-points/point-1/time-series',
      {
        name: 'Temperatura',
        unit: '°C',
        samples: [
          { timestamp: '2026-11-22T10:00:00Z', value: 31.5 },
          { timestamp: '2026-11-22T10:10:00Z', value: 32 },
        ],
      },
    );
  });

  it('should ask for the name and the file, and not call the api', async () => {
    const post = vi.spyOn(api, 'post');
    renderDialog();

    fill({ name: '   ', csv: null });
    send();

    expect(await screen.findByText('Informe o nome da série')).toBeTruthy();
    expect(screen.getByText('Escolha um arquivo CSV')).toBeTruthy();
    expect(post).not.toHaveBeenCalled();
  });

  it('should say in which line of the file a sample is invalid', async () => {
    const post = vi.spyOn(api, 'post');
    renderDialog();

    // Linhas 1 a 3: o CSV certo (cabeçalho e 2 medições); linha 4: sem fuso
    fill({ csv: `${CSV}\n2026-11-22T10:20:00,33` });
    send();

    expect(
      await screen.findByText(
        'Linha 4: Use data e hora com fuso, ex.: 2026-11-22T10:00:00Z',
      ),
    ).toBeTruthy();
    expect(post).not.toHaveBeenCalled();
  });

  it('should show the format error of the file', async () => {
    renderDialog();

    fill({ csv: '2026-11-22T10:00:00Z,31,5' });
    send();

    expect(
      await screen.findByText('Linha 1: use o formato instante,valor'),
    ).toBeTruthy();
  });

  it('should explain when the file has too many samples', async () => {
    renderDialog();
    const start = Date.UTC(2026, 10, 22);
    const rows = Array.from(
      { length: MAX_TIME_SERIES_SAMPLES + 1 },
      (_, index) => `${new Date(start + index * 1000).toISOString()},1`,
    );

    fill({ csv: rows.join('\n') });
    send();

    expect(
      await screen.findByText('Envie no máximo 10.000 medições'),
    ).toBeTruthy();
  });

  it('should show the error message of the api', async () => {
    const error = new AxiosError('Request failed', 'ERR_BAD_REQUEST');
    error.response = {
      status: 409,
      data: {
        error: {
          code: 'POINT_WITHOUT_SENSOR',
          message: 'Coloque um sensor no ponto antes de enviar dados',
        },
      },
    } as AxiosResponse;
    vi.spyOn(api, 'post').mockRejectedValue(error);
    const { onUploaded } = renderDialog();

    fill({});
    send();

    expect(
      await screen.findByText(
        'Coloque um sensor no ponto antes de enviar dados',
      ),
    ).toBeTruthy();
    expect(onUploaded).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeTruthy();
  });

  it('should close when canceled', () => {
    const { onClose } = renderDialog();

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(onClose).toHaveBeenCalled();
  });
});
