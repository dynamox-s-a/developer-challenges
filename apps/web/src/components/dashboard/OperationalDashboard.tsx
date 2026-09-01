import RefreshIcon from '@mui/icons-material/Refresh';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  createSelectDashboardView,
  selectDashboard,
  selectDashboardInventoryLoading,
  selectDashboardPartialErrors,
} from '../../features/dashboard/dashboardSelectors';
import {
  anchoredRangeForPeriod,
  dashboardSeriesAutoSelected,
  dashboardSeriesSelected,
  fetchActivityHeatmap,
  fetchAlertsSummary,
  fetchDashboardSeriesDetail,
  fetchFleetCondition,
  fetchOperationalDashboard,
  periodChanged,
} from '../../features/dashboard/dashboardSlice';
import { hourWindowPath } from '../../features/time/instant';
import { useAppDispatch, useAppSelector } from '../../store';
import { AssetConditionColumns } from './AssetConditionColumns';
import { DashboardHeader } from './DashboardHeader';
import { DataQualityPanel } from './DataQualityPanel';
import { HourProfilePanel } from './HourProfilePanel';
import { SeverityOffendersPanel } from './SeverityOffendersPanel';
import { FleetConditionMatrix } from './FleetConditionMatrix';
import { InspectionPriorityTable } from './InspectionPriorityTable';
import { KpiRow } from './KpiRow';
import { RecentOccurrences } from './RecentOccurrences';
import { SensorHealthDonut } from './SensorHealthDonut';
import { TrendPanel } from './TrendPanel';
import { ActivityHeatmap } from './ActivityHeatmap';

/**
 * Central operacional de condition monitoring num único grid de 12 colunas, em faixas
 * de 2/3 + 1/3: à esquerda o que precisa de eixo horizontal (tabela, séries temporais,
 * 24 horas), à direita os painéis compactos empilhados, alinhados pela faixa.
 *
 *   KPIs                3 + 3 + 3 + 3
 *   Onde investigar     Prioridade de inspeção 8 | Saúde dos sensores 4
 *   Evidência           Tendência crítica 8      | Ocorrências recentes / Qualidade dos dados 4
 *   Padrão temporal     Mapa de calor 8          | Horários de pico / Atividade de aquisição 4
 *   Frota e exploração  Explorador 8             | Condição por ativo / Matriz da frota 4
 *
 * Cada faixa junta painéis da mesma pergunta — a coluna estreita comenta a larga
 * (o perfil detalha o dia escolhido no heatmap; condição por ativo e matriz olham as
 * mesmas máquinas). A ordem do DOM é a de leitura; `order` reempilha no celular.
 */
export function OperationalDashboard(): JSX.Element {
  const dispatch = useAppDispatch();
  const [nowMs] = useState(() => Date.now());
  const selectView = useMemo(() => createSelectDashboardView(nowMs), [nowMs]);
  const dashboard = useAppSelector(selectDashboard);
  const view = useAppSelector(selectView);
  const inventoryLoading = useAppSelector(selectDashboardInventoryLoading);
  const partialErrors = useAppSelector(selectDashboardPartialErrors);
  const investigationRef = useRef<HTMLHeadingElement>(null);
  const gridGap = useTheme().dashboard.gridGap;
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const navigate = useNavigate();
  // O mesmo recorte que alimenta as consultas viaja nos links: sair do painel para uma
  // página de investigação não pode significar recomeçar com outro período.
  const range = useMemo(() => {
    const period = anchoredRangeForPeriod(dashboard.period, dashboard.series.data, nowMs);
    return { from: period.from, to: period.to };
  }, [dashboard.period, dashboard.series.data, nowMs]);

  useEffect(() => {
    void dispatch(fetchOperationalDashboard());
  }, [dispatch]);

  // Segunda etapa: fora do caminho crítico do primeiro render — a tela já está
  // utilizável enquanto a avaliação de condição chega.
  useEffect(() => {
    if (dashboard.series.status === 'succeeded' && dashboard.conditionStatus === 'idle') {
      void dispatch(fetchFleetCondition());
      void dispatch(fetchActivityHeatmap());
      void dispatch(fetchAlertsSummary());
    }
  }, [dispatch, dashboard.series.status, dashboard.conditionStatus]);

  // Ao terminar a avaliação, o painel mostra a maior exceção — a menos que a pessoa já
  // tenha escolhido outra série.
  useEffect(() => {
    const alvo = view.ranking[0]?.preferredSeriesId ?? view.priority[0]?.preferredSeriesId;
    if (dashboard.conditionStatus === 'succeeded' && alvo) {
      dispatch(dashboardSeriesAutoSelected(alvo));
    }
  }, [dispatch, dashboard.conditionStatus, view.ranking, view.priority]);

  /*
   * O período agora é recortado pelo SERVIDOR (antes o cliente filtrava as amostras que já
   * tinha): trocar a janela precisa refazer a consulta, senão o painel mostraria a janela
   * antiga com o rótulo novo.
   */
  useEffect(() => {
    if (dashboard.selectedSeriesId) {
      void dispatch(fetchDashboardSeriesDetail(dashboard.selectedSeriesId));
    }
  }, [dispatch, dashboard.selectedSeriesId, dashboard.period]);

  const selectSeries = useCallback(
    (seriesId: string) => {
      dispatch(dashboardSeriesSelected(seriesId));
    },
    [dispatch],
  );

  /**
   * Drill-down: troca o contexto E leva a pessoa até a evidência temporal — com foco,
   * para o caminho existir também no teclado.
   */
  const investigate = useCallback(
    (seriesId: string) => {
      selectSeries(seriesId);
      const heading = investigationRef.current;
      if (!heading) return;
      heading.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
      heading.focus?.({ preventScroll: true });
    },
    [selectSeries],
  );

  /**
   * Drill-down temporal: a célula do mapa vira uma rota com a janela na URL. Nenhum dado
   * novo é carregado aqui — quem consulta é a página de destino, já recortada.
   */
  const investigateWindow = useCallback(
    (bucketStart: string) => navigate(hourWindowPath(bucketStart)),
    [navigate],
  );

  const retryDetail = () => {
    if (dashboard.selectedSeriesId) {
      void dispatch(fetchDashboardSeriesDetail(dashboard.selectedSeriesId));
    }
  };

  const evaluating =
    dashboard.conditionStatus === 'loading' || dashboard.conditionStatus === 'idle';

  /** Item do grid principal: colunas por breakpoint e posição no empilhamento. */
  const slot = (opts: { md?: number; lg?: number; xs: number; md_order?: number }) => ({
    gridColumn: {
      xs: 'span 12',
      md: `span ${opts.md ?? 12}`,
      lg: opts.lg === undefined ? 'auto' : `span ${opts.lg}`,
    },
    order: { xs: opts.xs, lg: 0 },
    minWidth: 0,
    display: 'flex',
    '& > *': { flex: 1, minWidth: 0 },
  });

  /**
   * Coluna estreita de uma faixa: dois painéis empilhados que dividem a altura do painel
   * largo ao lado. Abaixo de `lg` ela se dissolve (`display: contents`) e cada painel
   * volta a ser um item do grid com o próprio span.
   */
  const stack = (rows: string) => ({
    display: { xs: 'contents', lg: 'grid' },
    gridColumn: { lg: 'span 4' },
    gridTemplateRows: { lg: rows },
    gap: `${gridGap}px`,
    minWidth: 0,
  });

  return (
    <>
      <DashboardHeader
        period={dashboard.period}
        loadedAt={dashboard.loadedAt}
        latestReading={view.latestTimestamp}
        nowMs={nowMs}
        onPeriodChange={(period) => dispatch(periodChanged(period))}
      />

      {partialErrors.length > 0 ? (
        <Alert
          severity="warning"
          sx={{ mb: `${gridGap}px` }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={() => void dispatch(fetchOperationalDashboard())}
            >
              Tentar novamente
            </Button>
          }
        >
          <AlertTitle>Dados parciais</AlertTitle>
          {partialErrors.join(' ')} As seções disponíveis continuam operacionais.
        </Alert>
      ) : null}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
          gap: `${gridGap}px`,
          alignItems: 'stretch',
        }}
      >
        {/* SITUAÇÃO — quatro perguntas, quatro números */}
        <KpiRow
          view={view}
          loading={inventoryLoading}
          range={range}
          alerts={dashboard.alerts}
          alertsLoading={dashboard.alertsStatus === 'idle' || dashboard.alertsStatus === 'loading'}
        />

        {/* ONDE INVESTIGAR — o ranking, e se os sensores que o alimentam estão vivos */}
        <Box sx={slot({ lg: 8, xs: 5 })}>
          <InspectionPriorityTable
            view={view}
            loading={inventoryLoading}
            evaluating={evaluating}
            selectedSeriesId={dashboard.selectedSeriesId}
            range={range}
            onInvestigate={investigate}
          />
        </Box>
        <Box sx={slot({ lg: 4, md: 6, xs: 8 })}>
          <SensorHealthDonut view={view} loading={inventoryLoading} alerts={dashboard.alerts} />
        </Box>

        {/* PADRÃO TEMPORAL — a severidade da semana logo abaixo da prioridade: onde piorou */}
        <Box sx={slot({ lg: 8, xs: 7 })}>
          <ActivityHeatmap
            data={dashboard.heatmap}
            loading={dashboard.heatmapStatus === 'loading' || dashboard.heatmapStatus === 'idle'}
            error={dashboard.heatmapError}
            onRetry={() => void dispatch(fetchActivityHeatmap())}
            onSelectWindow={investigateWindow}
          />
        </Box>
        <Box sx={stack('1fr 1fr')}>
          <Box sx={slot({ md: 6, xs: 8 })}>
            <HourProfilePanel
              data={dashboard.heatmap}
              loading={dashboard.heatmapStatus === 'loading' || dashboard.heatmapStatus === 'idle'}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              onSelectWindow={investigateWindow}
            />
          </Box>
          <Box sx={slot({ md: 6, xs: 9 })}>
            <SeverityOffendersPanel
              heatmap={dashboard.heatmap}
              loading={dashboard.heatmapStatus === 'loading' || dashboard.heatmapStatus === 'idle'}
              onSelectWindow={investigateWindow}
            />
          </Box>
        </Box>

        {/* EVIDÊNCIA — a série do item investigado (o único painel de série da home) */}
        <Box sx={slot({ lg: 8, xs: 10 })}>
          <TrendPanel
            period={dashboard.period}
            series={dashboard.series.data}
            selectedSeriesId={dashboard.selectedSeriesId}
            detail={dashboard.detailPoints}
            status={dashboard.detailStatus}
            error={dashboard.detailError}
            onRetry={retryDetail}
            onSelectSeries={selectSeries}
            onPeriodChange={(period) => dispatch(periodChanged(period))}
            headingRef={investigationRef}
          />
        </Box>
        <Box sx={stack('minmax(0, 1fr) auto')}>
          <Box sx={slot({ md: 6, xs: 11 })}>
            <RecentOccurrences
              alerts={dashboard.alerts}
              status={dashboard.alertsStatus}
              error={dashboard.alertsError}
              onRetry={() => void dispatch(fetchAlertsSummary())}
            />
          </Box>
          <Box sx={slot({ md: 6, xs: 12 })}>
            <DataQualityPanel view={view} loading={inventoryLoading} />
          </Box>
        </Box>

        {/* FROTA — as mesmas máquinas em duas leituras, fechando a página */}
        <Box sx={slot({ lg: 6, xs: 13 })}>
          <AssetConditionColumns view={view} loading={inventoryLoading} />
        </Box>
        <Box sx={slot({ lg: 6, xs: 14 })}>
          <FleetConditionMatrix
            view={view}
            loading={inventoryLoading}
            nowMs={nowMs}
            selectedSeriesId={dashboard.selectedSeriesId}
            range={range}
          />
        </Box>
      </Box>
    </>
  );
}
