/**
 * Modelos de resposta expostos no OpenAPI.
 *
 * São classes (e não interfaces) porque o gerador do Swagger lê metadados em tempo de
 * execução: só assim cada rota publica um schema navegável, com exemplos, em vez de uma
 * frase descrevendo o formato. Os tipos de domínio continuam sendo a fonte de verdade —
 * estas classes existem para descrevê-los no contrato público.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const ISO = '2026-08-31T08:00:00.000Z';

export class ErrorResponse {
  @ApiProperty({
    description: 'Código estável do erro; use-o para tratar o caso, não a mensagem.',
    example: 'MACHINE_NAME_CONFLICT',
  })
  code!: string;

  @ApiProperty({
    description: 'Mensagem legível, sujeita a mudanças de redação.',
    example: 'Já existe uma máquina com este nome.',
  })
  message!: string;

  /**
   * Alguns erros da ingestão acrescentam contexto para que o produtor corrija o payload
   * sem adivinhar. `code` e `message` estão sempre presentes; estes campos, não.
   */
  @ApiPropertyOptional({
    description: 'Violações do contrato de telemetria (CONTRACT_VIOLATION).',
    type: 'array',
    items: { type: 'object', properties: { path: { type: 'string' }, message: { type: 'string' } } },
  })
  violations?: Array<{ path: string; message: string }>;

  @ApiPropertyOptional({
    description: 'Série envolvida no conflito (SAMPLE_TIMESTAMP_CONFLICT, SERIES_UNIT_CONFLICT).',
    format: 'uuid',
    type: String,
  })
  timeSeriesId?: string;

  @ApiPropertyOptional({
    description: 'Instantes que já existiam na série (SAMPLE_TIMESTAMP_CONFLICT).',
    type: [String],
    example: ['2026-09-10T12:00:00.000Z'],
  })
  conflictingTimestamps?: string[];
}

export class SessionUserResponse {
  @ApiProperty({ format: 'uuid', example: 'e296fc5c-c2b1-4941-b363-0ee813b213e1' })
  id!: string;

  @ApiProperty({ format: 'email', example: 'analista@dynamox.local' })
  email!: string;

  @ApiProperty({ example: 'Analista de Manutenção' })
  name!: string;

  @ApiProperty({
    enum: ['ADMIN', 'VIEWER'],
    description:
      'ADMIN consulta e altera; VIEWER apenas consulta — mutações respondem 403 para ele.',
    example: 'ADMIN',
  })
  role!: 'ADMIN' | 'VIEWER';
}

export class LoginResponse {
  @ApiProperty({
    description: 'JWT para o header Authorization: Bearer <token>.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMjk2ZmM1Yy...',
  })
  token!: string;

  @ApiProperty({ type: SessionUserResponse })
  user!: SessionUserResponse;
}

export class HealthResponse {
  @ApiProperty({ enum: ['ok', 'degraded'], example: 'ok' })
  status!: 'ok' | 'degraded';

  @ApiProperty({ enum: ['up', 'down'], example: 'up' })
  database!: 'up' | 'down';

  @ApiProperty({ example: '0.1.0' })
  version!: string;

  @ApiProperty({ format: 'date-time', example: ISO })
  timestamp!: string;
}

export class MachineResponse {
  @ApiProperty({ format: 'uuid', example: '6f3d4a1e-9c2b-4f7a-8d51-0b2f1c9e7a10' })
  id!: string;

  @ApiProperty({ maxLength: 120, example: 'P-101' })
  name!: string;

  @ApiProperty({
    enum: ['Pump', 'Fan'],
    description: 'Máquinas Pump recusam sensores TcAg e TcAs.',
    example: 'Pump',
  })
  type!: 'Pump' | 'Fan';

  @ApiProperty({ format: 'date-time', example: ISO })
  createdAt!: string;

  @ApiProperty({ format: 'date-time', example: ISO })
  updatedAt!: string;
}

export class SensorResponse {
  @ApiProperty({ format: 'uuid', example: '2b7c1f80-5a44-4c0e-9d3b-77e1a5c6d200' })
  id!: string;

  @ApiProperty({
    description: 'Identificador único do sensor em toda a instalação.',
    maxLength: 60,
    example: 'SIM-HF-001',
  })
  serialNumber!: string;

  @ApiProperty({ enum: ['TcAg', 'TcAs', 'HF+'], example: 'HF+' })
  model!: 'TcAg' | 'TcAs' | 'HF+';
}

export class MonitoringPointMachineResponse {
  @ApiProperty({ format: 'uuid', example: '6f3d4a1e-9c2b-4f7a-8d51-0b2f1c9e7a10' })
  id!: string;

  @ApiProperty({ example: 'P-101' })
  name!: string;

  @ApiProperty({ enum: ['Pump', 'Fan'], example: 'Pump' })
  type!: 'Pump' | 'Fan';
}

export class MonitoringPointResponse {
  @ApiProperty({ format: 'uuid', example: 'c81a55f2-3f0d-4a2b-93a6-1d5e2f4b8c33' })
  id!: string;

  @ApiProperty({ maxLength: 120, example: 'Mancal lado acoplamento' })
  name!: string;

  @ApiProperty({ type: MonitoringPointMachineResponse })
  machine!: MonitoringPointMachineResponse;

  @ApiProperty({
    type: SensorResponse,
    nullable: true,
    description: 'Cada ponto aceita no máximo um sensor; null quando ainda não há um.',
  })
  sensor!: SensorResponse | null;

  @ApiProperty({ format: 'date-time', example: ISO })
  createdAt!: string;

  @ApiProperty({ format: 'date-time', example: ISO })
  updatedAt!: string;
}

export class MonitoringPointPageResponse {
  @ApiProperty({ type: [MonitoringPointResponse] })
  items!: MonitoringPointResponse[];

  @ApiProperty({
    description: 'Total de pontos no recorte pedido — não é o tamanho da tabela.',
    example: 12,
  })
  total!: number;

  @ApiProperty({ minimum: 1, example: 1 })
  page!: number;

  @ApiProperty({
    description: 'A tela do desafio usa 5; a API aceita até 50 para consumo programático.',
    minimum: 1,
    maximum: 50,
    example: 5,
  })
  pageSize!: number;

  @ApiProperty({ description: 'Páginas do recorte, já arredondado para cima.', example: 3 })
  totalPages!: number;

  @ApiProperty({ enum: ['machineName', 'machineType', 'pointName', 'sensorModel'], example: 'machineName' })
  sortBy!: string;

  @ApiProperty({ enum: ['asc', 'desc'], example: 'asc' })
  sortDir!: 'asc' | 'desc';

  /**
   * `type` explícito é obrigatório nos campos anuláveis: o gerador lê o metadado de
   * runtime do TypeScript, e uma união com null chega como Object — o contrato sairia
   * publicando `type: object` para o que é, de fato, string.
   */
  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Eco do recorte aplicado: confirma o que o servidor considerou.',
    example: null,
  })
  search!: string | null;

  @ApiProperty({ enum: ['Pump', 'Fan'], nullable: true, example: null })
  machineType!: 'Pump' | 'Fan' | null;

  @ApiProperty({ enum: ['TcAg', 'TcAs', 'HF+'], nullable: true, example: null })
  sensorModel!: 'TcAg' | 'TcAs' | 'HF+' | null;

  @ApiProperty({ type: Boolean, nullable: true, example: null })
  hasSensor!: boolean | null;
}

export class TimeSeriesSummaryResponse {
  @ApiProperty({ format: 'uuid', example: '3d3a56de-0fd7-4db9-84ea-5254bfd7b549' })
  id!: string;

  @ApiProperty({ example: 'P-101' })
  machineName!: string;

  @ApiProperty({ example: 'Mancal lado acoplamento' })
  monitoringPointName!: string;

  @ApiProperty({ example: 'SIM-HF-001' })
  sensorSerialNumber!: string;

  @ApiProperty({ enum: ['TcAg', 'TcAs', 'HF+'], example: 'HF+' })
  sensorModel!: string;

  @ApiProperty({
    enum: ['acceleration', 'velocity', 'temperature', 'rotationalSpeed'],
    example: 'acceleration',
  })
  physicalQuantity!: string;

  @ApiProperty({
    enum: ['x', 'y', 'z'],
    nullable: true,
    description: 'Grandezas escalares (temperatura, rotação) não têm eixo.',
    example: 'y',
  })
  axis!: string | null;

  @ApiProperty({ description: 'Unidade no vocabulário público.', example: 'g' })
  unit!: string;

  @ApiProperty({
    type: Number,
    nullable: true,
    description:
      'Total de amostras da série; null quando a listagem foi pedida sem contagem (withCounts=false).',
    example: 60,
  })
  sampleCount!: number | null;

  @ApiProperty({
    description:
      'Valor da amostra mais recente da série; null quando a série ainda não tem amostras.',
    type: Number,
    nullable: true,
    example: 0.0575,
  })
  lastValue!: number | null;

  @ApiProperty({
    description: 'Instante da amostra mais recente (UTC). null quando a série está vazia.',
    type: String,
    format: 'date-time',
    nullable: true,
    example: ISO,
  })
  lastTimestamp!: string | null;
}

export class SeriesMetricsResponse {
  @ApiProperty({ example: 270 })
  count!: number;

  @ApiProperty({ type: Number, nullable: true, example: 0.0195 })
  min!: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 0.0324 })
  max!: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 0.0258 })
  avg!: number | null;

  @ApiProperty({
    type: Number,
    description: 'Valor da amostra mais recente.',
    nullable: true,
    example: 0.0303,
  })
  last!: number | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, example: ISO })
  firstTimestamp!: string | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
    example: '2026-08-31T08:04:29.000Z',
  })
  lastTimestamp!: string | null;
}

export class TimeSeriesSampleResponse {
  @ApiProperty({ format: 'date-time', example: ISO })
  timestamp!: string;

  @ApiProperty({ example: 0.024681 })
  value!: number;
}

export class TimeSeriesSamplePageResponse {
  @ApiProperty({ type: [TimeSeriesSampleResponse] })
  items!: TimeSeriesSampleResponse[];

  @ApiProperty({ description: 'Total de amostras da série, ignorando a janela pedida.', example: 270 })
  total!: number;

  @ApiProperty({ minimum: 1, maximum: 5000, example: 500 })
  limit!: number;

  @ApiProperty({ minimum: 0, example: 0 })
  offset!: number;
}

export class TelemetryIngestionResponse {
  @ApiProperty({
    description:
      'true quando o ciclo já havia sido ingerido: a repetição é aceita (200) sem gravar de novo.',
    example: false,
  })
  duplicate!: boolean;

  @ApiProperty({
    description:
      'Identificador do ciclo persistido, gerado pela API. Não confundir com metadata.cycleId do payload, que é guardado como rastro do produtor.',
    format: 'uuid',
    example: 'abea2728-017c-4f0c-bfd4-cc522bee056d',
  })
  cycleId!: string;

  @ApiProperty({ description: 'Valor recebido no header Idempotency-Key.', example: 'sim.SIM-HF-001.normal.s42.20260831T080000Z.2a6e4f0c' })
  idempotencyKey!: string;

  @ApiProperty({
    description: 'SHA-256 canônico do conteúdo; igual para payloads equivalentes.',
    example: '6586e6345f9cbd4c1f0a...c2886055',
  })
  payloadFingerprint!: string;

  @ApiProperty({ example: 5 })
  measurementCount!: number;

  @ApiProperty({ example: 300 })
  sampleCount!: number;

  @ApiProperty({
    type: [String],
    description: 'Séries afetadas, criadas ou reutilizadas.',
    example: ['3d3a56de-0fd7-4db9-84ea-5254bfd7b549'],
  })
  timeSeriesIds!: string[];
}

// ————— Analytics —————

export class TrendPointResponse {
  @ApiProperty({ format: 'date-time', description: 'Início do bucket agregado.', example: ISO })
  timestamp!: string;

  @ApiProperty({ description: 'RMS do eixo âncora no bucket.', example: 0.0171 })
  value!: number;
}

export class FleetConditionPointResponse {
  @ApiProperty({ description: 'Máquina do ponto.', example: 'P-101' })
  machineName!: string;

  @ApiProperty({ type: String, nullable: true, description: 'Tipo público da máquina.', example: 'Pump' })
  machineType!: string | null;

  @ApiProperty({ format: 'uuid', description: 'Identificador do ponto de monitoramento.' })
  monitoringPointId!: string;

  @ApiProperty({ description: 'Nome do ponto.', example: 'Mancal lado oposto ao acoplamento' })
  monitoringPointName!: string;

  @ApiProperty({ type: String, nullable: true, description: 'Sensor associado, quando existe.', example: 'SIM-HF-002' })
  sensorSerialNumber!: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'Modelo público do sensor.', example: 'HF+' })
  sensorModel!: string | null;

  @ApiProperty({
    description: 'Classificação demonstrativa (limiares didáticos 1,5x e 2,0x).',
    enum: ['normal', 'observation', 'attention', 'unclassified', 'no-data', 'no-sensor'],
    example: 'attention',
  })
  condition!: string;

  @ApiProperty({
    description: 'Recência da última leitura (24 h para desatualizado, 5 min de tolerância no futuro).',
    enum: ['current', 'stale', 'future', 'unknown'],
    example: 'current',
  })
  freshness!: string;

  @ApiProperty({ type: Number, nullable: true, description: 'RMS radial (Y/Z) da aquisição mais recente da janela.', example: 0.0571 })
  currentValue!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'RMS radial da aquisição de referência da janela.', example: 0.0164 })
  baselineValue!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Razão entre a aquisição atual e a de referência.', example: 3.49 })
  deviationRatio!: number | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Instante da aquisição atual.', example: ISO })
  currentAt!: string | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Instante da aquisição de referência.', example: ISO })
  baselineAt!: string | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Amostras da aquisição atual no eixo âncora.', example: 60 })
  currentSampleCount!: number | null;

  @ApiProperty({ type: String, format: 'uuid', nullable: true, description: 'Ciclo de ingestão da aquisição atual.' })
  currentCycleId!: string | null;

  @ApiProperty({ type: String, format: 'uuid', nullable: true, description: 'Ciclo de ingestão da aquisição de referência.' })
  baselineCycleId!: string | null;

  @ApiProperty({ description: 'Unidade das grandezas radiais.', example: 'g' })
  unit!: string;

  @ApiProperty({
    type: [TrendPointResponse],
    description:
      'Tendência curta (até 12 buckets das últimas 24 h da janela). Vazia sem includeTrend=true.',
  })
  trend!: TrendPointResponse[];
}

export class ConditionCountsResponse {
  @ApiProperty({ description: 'Itens no recorte, antes do filtro de condição.', example: 12 })
  total!: number;

  @ApiProperty({ description: 'Itens em atenção (razão ≥ 2,0×).', example: 1 })
  attention!: number;

  @ApiProperty({ description: 'Itens em observação (razão ≥ 1,5×).', example: 0 })
  observation!: number;

  @ApiProperty({ description: 'Itens dentro do esperado.', example: 11 })
  normal!: number;

  @ApiProperty({ description: 'Itens com leitura mas sem referência comparável.', example: 0 })
  unclassified!: number;

  @ApiProperty({ description: 'Pontos instrumentados que não reportaram.', example: 0 })
  noData!: number;

  @ApiProperty({ description: 'Pontos sem sensor instalado.', example: 0 })
  noSensor!: number;
}

export class FleetConditionResponse {
  @ApiProperty({ format: 'date-time', description: 'Início da janela consultada.', example: ISO })
  from!: string;

  @ApiProperty({ format: 'date-time', description: 'Fim exclusivo da janela consultada.', example: ISO })
  to!: string;

  @ApiProperty({ format: 'date-time', description: 'Instante da avaliação (base da recência).', example: ISO })
  generatedAt!: string;

  @ApiProperty({ type: [FleetConditionPointResponse], description: 'Um item por ponto de monitoramento.' })
  points!: FleetConditionPointResponse[];

  @ApiProperty({ type: ConditionCountsResponse, description: 'Contagem por condição ANTES do filtro.' })
  counts!: ConditionCountsResponse;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Recorte de condição aplicado; nulo quando nenhum foi pedido.',
    enum: ['attention', 'observation', 'normal', 'unclassified', 'no-data', 'no-sensor'],
    example: 'attention',
  })
  condition!: string | null;
}

export class SeriesBucketPointResponse {
  @ApiProperty({ format: 'date-time', description: 'Início do bucket.', example: ISO })
  bucketStart!: string;

  @ApiProperty({ description: 'Amostras agregadas no bucket.', example: 900 })
  sampleCount!: number;

  @ApiProperty({ description: 'Aquisições (ciclos de ingestão) iniciadas no bucket, contadas no ledger de evidência por ciclo.', example: 15 })
  acquisitionCount!: number;

  @ApiProperty({ type: Number, nullable: true, description: 'Média do bucket.', example: 0.0164 })
  avg!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Mínimo do bucket.', example: 0.0121 })
  min!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Máximo do bucket.', example: 0.0208 })
  max!: number | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Última amostra do bucket.', example: ISO })
  lastAt!: string | null;
}

export class SeriesWindowStatsResponse {
  @ApiProperty({ description: 'Amostras na janela.', example: 40320 })
  sampleCount!: number;

  @ApiProperty({ description: 'Aquisições (ciclos de ingestão) iniciadas na janela, contadas no ledger de evidência por ciclo.', example: 672 })
  acquisitionCount!: number;

  @ApiProperty({ type: Number, nullable: true, description: 'Mínimo da janela.', example: 0.0119 })
  min!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Máximo da janela.', example: 0.0611 })
  max!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Média da janela.', example: 0.0177 })
  avg!: number | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Primeira amostra da janela.', example: ISO })
  firstAt!: string | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Última amostra da janela.', example: ISO })
  lastAt!: string | null;
}

export class SeriesPointsResponse {
  @ApiProperty({ format: 'uuid', description: 'Série consultada.' })
  seriesId!: string;

  @ApiProperty({ format: 'date-time', description: 'Início da janela.', example: ISO })
  from!: string;

  @ApiProperty({ format: 'date-time', description: 'Fim exclusivo da janela.', example: ISO })
  to!: string;

  @ApiProperty({ description: 'Bucket aplicado.', enum: ['15m', '1h', '4h', '1d'], example: '1h' })
  bucket!: string;

  @ApiProperty({ type: SeriesWindowStatsResponse, description: 'Estatísticas da janela inteira.' })
  stats!: SeriesWindowStatsResponse;

  @ApiProperty({ type: [SeriesBucketPointResponse], description: 'Pontos agregados, em ordem cronológica.' })
  points!: SeriesBucketPointResponse[];
}

export class HeatmapBucketResponse {
  @ApiProperty({ format: 'date-time', description: 'Início do bucket.', example: ISO })
  bucketStart!: string;

  @ApiProperty({ format: 'date-time', description: 'Fim exclusivo do bucket.', example: ISO })
  bucketEnd!: string;

  @ApiProperty({ description: 'Dia do bucket (UTC).', example: '2026-08-30' })
  day!: string;

  @ApiProperty({ description: 'Hora do bucket (0–23; 0 quando o bucket é diário).', example: 14 })
  hour!: number;

  @ApiProperty({ description: 'Amostras persistidas pelas aquisições iniciadas no bucket (soma de `sampleCount` dos ciclos).', example: 720 })
  sampleCount!: number;

  @ApiProperty({ description: 'Aquisições (ciclos de ingestão) iniciadas no bucket, contadas no ledger de evidência por ciclo.', example: 12 })
  acquisitionCount!: number;

  @ApiProperty({ description: 'Sensores que reportaram no bucket.', example: 12 })
  reportingSensors!: number;

  @ApiProperty({ description: 'Sensores esperados (instrumentados).', example: 12 })
  expectedSensors!: number;

  @ApiProperty({ description: 'Cobertura do bucket em porcentagem.', example: 100 })
  coveragePercent!: number;
  @ApiProperty({
    type: Number,
    nullable: true,
    description:
      'Maior desvio radial da frota no bucket: a leitura mais alta dividida pela baseline saudável do próprio ponto naquela hora UTC. É a magnitude que o mapa pinta. Nulo quando nenhum ponto do bucket tem baseline estabelecida.',
    example: 3.58,
  })
  maxDeviationRatio!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'RMS radial (g) que produziu esse desvio.', example: 0.0559 })
  maxDeviationValue!: number | null;

  @ApiProperty({ type: String, nullable: true, description: 'Sensor que produziu o desvio.', example: 'SIM-HF-002' })
  maxDeviationSensor!: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'Máquina do sensor.', example: 'P-101' })
  maxDeviationMachine!: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'Ponto monitorado do sensor.', example: 'Mancal lado oposto ao acoplamento' })
  maxDeviationPoint!: string | null;

}

export class HeatmapResponse {
  @ApiProperty({ format: 'date-time', description: 'Início da janela.', example: ISO })
  from!: string;

  @ApiProperty({ format: 'date-time', description: 'Fim exclusivo da janela.', example: ISO })
  to!: string;

  @ApiProperty({ description: 'Granularidade das células.', enum: ['hour', 'day'], example: 'hour' })
  bucket!: string;

  @ApiProperty({ description: 'Sensores instrumentados considerados na cobertura.', example: 12 })
  expectedSensors!: number;

  @ApiProperty({ type: [HeatmapBucketResponse], description: 'Células com atividade, em ordem cronológica.' })
  buckets!: HeatmapBucketResponse[];
}

export class TimeWindowSensorResponse {
  @ApiProperty({ description: 'Sensor.', example: 'SIM-HF-002' })
  sensorSerialNumber!: string;

  @ApiProperty({ description: 'Modelo público.', example: 'HF+' })
  sensorModel!: string;

  @ApiProperty({ format: 'uuid', description: 'Série âncora (aceleração Y) usada no resumo.' })
  seriesId!: string;

  @ApiProperty({ type: String, nullable: true, description: 'Máquina.', example: 'P-101' })
  machineName!: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'Tipo da máquina.', example: 'Pump' })
  machineType!: string | null;

  @ApiProperty({ type: String, nullable: true, format: 'uuid', description: 'Ponto de monitoramento.' })
  monitoringPointId!: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'Nome do ponto.', example: 'Mancal lado acoplamento' })
  monitoringPointName!: string | null;

  @ApiProperty({ description: 'Amostras da série âncora na janela.', example: 180 })
  sampleCount!: number;

  @ApiProperty({ description: 'Aquisições (ciclos de ingestão) iniciadas na janela, contadas no ledger de evidência por ciclo.', example: 3 })
  acquisitionCount!: number;

  @ApiProperty({ type: Number, nullable: true, description: 'Mínimo na janela.', example: 0.0121 })
  min!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Máximo na janela.', example: 0.0611 })
  max!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Média na janela.', example: 0.0164 })
  avg!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Última leitura da janela.', example: 0.0166 })
  lastValue!: number | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Instante da última leitura.', example: ISO })
  lastAt!: string | null;

  @ApiProperty({ description: 'Unidade.', example: 'g' })
  unit!: string;
}

export class TimeWindowKpisResponse {
  @ApiProperty({ description: 'Sensores que reportaram na janela.', example: 12 })
  reportingSensors!: number;

  @ApiProperty({ description: 'Sensores sem leitura na janela.', example: 0 })
  silentSensors!: number;

  @ApiProperty({ description: 'Sensores instrumentados.', example: 12 })
  expectedSensors!: number;

  @ApiProperty({ description: 'Aquisições na janela.', example: 48 })
  acquisitionCount!: number;

  @ApiProperty({ description: 'Amostras da janela (séries âncora).', example: 2880 })
  sampleCount!: number;

  @ApiProperty({ type: Number, nullable: true, description: 'Maior valor observado.', example: 0.0611 })
  maxValue!: number | null;

  @ApiProperty({ type: String, nullable: true, description: 'Sensor do maior valor.', example: 'SIM-HF-002' })
  maxValueSensor!: string | null;
}

export class TimeWindowResponse {
  @ApiProperty({ format: 'date-time', description: 'Início da janela.', example: ISO })
  from!: string;

  @ApiProperty({ format: 'date-time', description: 'Fim exclusivo da janela.', example: ISO })
  to!: string;

  @ApiProperty({ type: TimeWindowKpisResponse, description: 'Indicadores da janela.' })
  kpis!: TimeWindowKpisResponse;

  @ApiProperty({ type: [TimeWindowSensorResponse], description: 'Página de sensores.' })
  items!: TimeWindowSensorResponse[];

  @ApiProperty({ description: 'Total de sensores considerados.', example: 12 })
  total!: number;

  @ApiProperty({ description: 'Página corrente.', example: 1 })
  page!: number;

  @ApiProperty({ description: 'Itens por página.', example: 25 })
  pageSize!: number;

  @ApiProperty({ description: 'Total de páginas.', example: 1 })
  totalPages!: number;
}

export class AcquisitionListItemResponse {
  @ApiProperty({ format: 'uuid', description: 'Ciclo de ingestão que representa a aquisição.' })
  cycleId!: string;

  @ApiProperty({ type: String, nullable: true, description: 'Identificador declarado pelo produtor.', example: 'sim.SIM-HF-002.normal.s42.20260830T140200Z.0cbbf495' })
  externalCycleId!: string | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Início do dado.', example: ISO })
  startedAt!: string | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Fim do dado.', example: ISO })
  endedAt!: string | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Duração em segundos.', example: 60 })
  durationSeconds!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Rotação declarada.', example: 1750 })
  rpm!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Carga declarada (%).', example: 74.1 })
  loadPercent!: number | null;

  @ApiProperty({ type: String, nullable: true, description: 'Cenário declarado pelo produtor.', example: 'normal' })
  scenario!: string | null;

  @ApiProperty({ description: 'Amostras do ciclo (todas as séries).', example: 300 })
  sampleCount!: number;

  @ApiProperty({ description: 'Amostras da série âncora.', example: 60 })
  anchorSampleCount!: number;

  @ApiProperty({ type: Number, nullable: true, description: 'Mínimo da série âncora.', example: 0.0121 })
  min!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Máximo da série âncora.', example: 0.0611 })
  max!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Média da série âncora.', example: 0.0164 })
  avg!: number | null;

  @ApiProperty({ type: String, nullable: true, description: 'Evento declarado na verdade-terreno.', example: 'imbalance' })
  event!: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'Estado esperado na verdade-terreno.', example: 'observation' })
  expectedState!: string | null;

  @ApiProperty({ description: 'Unidade da série âncora.', example: 'g' })
  unit!: string;
}

export class AcquisitionPageResponse {
  @ApiProperty({ description: 'Sensor consultado.', example: 'SIM-HF-002' })
  serialNumber!: string;

  @ApiProperty({ format: 'date-time', description: 'Início da janela.', example: ISO })
  from!: string;

  @ApiProperty({ format: 'date-time', description: 'Fim exclusivo da janela.', example: ISO })
  to!: string;

  @ApiProperty({ type: [AcquisitionListItemResponse], description: 'Aquisições da página, mais recentes primeiro.' })
  items!: AcquisitionListItemResponse[];

  @ApiProperty({ description: 'Página corrente.', example: 1 })
  page!: number;

  @ApiProperty({ description: 'Itens por página.', example: 25 })
  pageSize!: number;

  @ApiProperty({ type: Number, nullable: true, description: 'Total de aquisições; null quando não solicitado.', example: null })
  total!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Total de páginas; null quando o total não foi solicitado.', example: null })
  totalPages!: number | null;

  @ApiProperty({ description: 'Existe página seguinte.', example: true })
  hasNextPage!: boolean;
}

export class AcquisitionSeriesSummaryResponse {
  @ApiProperty({ format: 'uuid', description: 'Série.' })
  seriesId!: string;

  @ApiProperty({ description: 'Grandeza física.', example: 'acceleration' })
  physicalQuantity!: string;

  @ApiProperty({ type: String, nullable: true, description: 'Eixo; nulo em grandezas escalares.', example: 'y' })
  axis!: string | null;

  @ApiProperty({ description: 'Unidade.', example: 'g' })
  unit!: string;

  @ApiProperty({ description: 'Amostras da série nesta aquisição.', example: 60 })
  sampleCount!: number;

  @ApiProperty({ type: Number, nullable: true, description: 'Mínimo.', example: 0.0121 })
  min!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Máximo.', example: 0.0611 })
  max!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Média.', example: 0.0164 })
  avg!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'RMS da aquisição.', example: 0.0172 })
  rms!: number | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Primeira amostra.', example: ISO })
  startedAt!: string | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Última amostra.', example: ISO })
  endedAt!: string | null;
}

export class AcquisitionDetailResponse {
  @ApiProperty({ format: 'uuid', description: 'Ciclo de ingestão.' })
  cycleId!: string;

  @ApiProperty({ type: String, nullable: true, description: 'Identificador do produtor.' })
  externalCycleId!: string | null;

  @ApiProperty({ description: 'Sensor.', example: 'SIM-HF-002' })
  sensorSerialNumber!: string;

  @ApiProperty({ type: String, nullable: true, description: 'Modelo público.', example: 'HF+' })
  sensorModel!: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'Máquina.', example: 'P-101' })
  machineName!: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'Ponto.', example: 'Mancal lado oposto ao acoplamento' })
  monitoringPointName!: string | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Início do dado.', example: ISO })
  startedAt!: string | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Fim do dado.', example: ISO })
  endedAt!: string | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Duração em segundos.', example: 60 })
  durationSeconds!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Rotação declarada.', example: 1750 })
  rpm!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Carga declarada.', example: 74.1 })
  loadPercent!: number | null;

  @ApiProperty({ type: String, nullable: true, description: 'Cenário declarado.', example: 'normal' })
  scenario!: string | null;

  @ApiProperty({ description: 'Origem da ingestão.', example: 'SIMULATION' })
  origin!: string;

  @ApiProperty({ type: [String], description: 'Tags do ciclo.', example: ['simulated', 'dataset:history'] })
  tags!: string[];

  @ApiProperty({ format: 'date-time', description: 'Instante da ingestão.', example: ISO })
  ingestedAt!: string;

  @ApiProperty({ description: 'Amostras do ciclo.', example: 300 })
  sampleCount!: number;

  @ApiProperty({ description: 'Medições do ciclo.', example: 5 })
  measurementCount!: number;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    nullable: true,
    description: 'Verdade-terreno declarada pelo gerador sintético, quando existe.',
  })
  groundTruth!: Record<string, unknown> | null;

  @ApiProperty({ type: [AcquisitionSeriesSummaryResponse], description: 'Resumo por série.' })
  series!: AcquisitionSeriesSummaryResponse[];
}

export class RawSampleResponse {
  @ApiProperty({ format: 'uuid', description: 'Identificador da amostra.' })
  id!: string;

  @ApiProperty({ format: 'date-time', description: 'Instante da amostra.', example: ISO })
  timestamp!: string;

  @ApiProperty({ description: 'Valor medido.', example: 0.0164 })
  value!: number;

  @ApiProperty({ description: 'Grandeza física.', example: 'acceleration' })
  physicalQuantity!: string;

  @ApiProperty({ type: String, nullable: true, description: 'Eixo.', example: 'y' })
  axis!: string | null;

  @ApiProperty({ description: 'Unidade.', example: 'g' })
  unit!: string;
}

export class RawSamplePageResponse {
  @ApiProperty({ format: 'uuid', description: 'Aquisição consultada.' })
  cycleId!: string;

  @ApiProperty({ type: [RawSampleResponse], description: 'Amostras da página, em ordem cronológica.' })
  items!: RawSampleResponse[];

  @ApiProperty({ description: 'Limite aplicado.', example: 500 })
  limit!: number;

  @ApiProperty({ type: String, nullable: true, description: 'Cursor da próxima página; null quando acabou.', example: null })
  nextCursor!: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'Filtro de grandeza aplicado.', example: null })
  quantity!: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'Filtro de eixo aplicado.', example: null })
  axis!: string | null;
}

export class MachinePointSummaryResponse {
  @ApiProperty({ format: 'uuid', description: 'Identificador do ponto de monitoramento.' })
  monitoringPointId!: string;

  @ApiProperty({ description: 'Nome do ponto.', example: 'Mancal lado oposto ao acoplamento' })
  monitoringPointName!: string;

  @ApiProperty({ description: 'Segmento de URL do ponto dentro do ativo.', example: 'mancal-lado-acoplamento' })
  slug!: string;

  @ApiProperty({ type: String, nullable: true, description: 'Sensor associado.', example: 'SIM-HF-002' })
  sensorSerialNumber!: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'Modelo público do sensor.', example: 'HF+' })
  sensorModel!: string | null;

  @ApiProperty({
    description: 'Classificação demonstrativa do ponto.',
    enum: ['normal', 'observation', 'attention', 'unclassified', 'no-data', 'no-sensor'],
    example: 'attention',
  })
  condition!: string;

  @ApiProperty({
    description: 'Recência da última leitura.',
    enum: ['current', 'stale', 'future', 'unknown'],
    example: 'current',
  })
  freshness!: string;

  @ApiProperty({ type: Number, nullable: true, description: 'RMS radial da aquisição atual.', example: 0.0571 })
  currentValue!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'RMS radial da aquisição de referência.', example: 0.0164 })
  baselineValue!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Razão entre atual e referência.', example: 3.49 })
  deviationRatio!: number | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Última leitura conhecida do ponto.', example: ISO })
  lastAt!: string | null;

  @ApiProperty({ description: 'Aquisições do ponto na janela.', example: 672 })
  acquisitionCount!: number;

  @ApiProperty({ description: 'Amostras da série âncora na janela.', example: 40320 })
  sampleCount!: number;

  @ApiProperty({ type: Number, nullable: true, description: 'Mínimo da janela.', example: 0.0121 })
  min!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Máximo da janela.', example: 0.0611 })
  max!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Média da janela.', example: 0.0187 })
  avg!: number | null;

  @ApiProperty({ description: 'Unidade das grandezas radiais.', example: 'g' })
  unit!: string;

  @ApiProperty({ type: [TrendPointResponse], description: 'Tendência curta do ponto.' })
  trend!: TrendPointResponse[];
}

export class MachineKpisResponse {
  @ApiProperty({ description: 'Pontos de monitoramento do ativo.', example: 2 })
  points!: number;

  @ApiProperty({ description: 'Pontos com sensor instalado.', example: 2 })
  sensors!: number;

  @ApiProperty({ description: 'Pontos em atenção ou observação.', example: 1 })
  attention!: number;

  @ApiProperty({ description: 'Aquisições do ativo na janela.', example: 1344 })
  acquisitionCount!: number;

  @ApiProperty({ description: 'Percentual de pontos que reportaram na janela.', example: 100 })
  coveragePercent!: number;

  @ApiProperty({ type: Number, nullable: true, description: 'Maior razão observada no ativo.', example: 3.49 })
  maxDeviationRatio!: number | null;

  @ApiProperty({ type: String, nullable: true, description: 'Ponto de maior razão.', example: 'Mancal lado oposto ao acoplamento' })
  maxDeviationPoint!: string | null;
}

export class MachineSummaryResponse {
  @ApiProperty({ format: 'uuid', description: 'Identificador da máquina.' })
  machineId!: string;

  @ApiProperty({ description: 'Nome cadastrado da máquina.', example: 'P-101' })
  machineName!: string;

  @ApiProperty({ description: 'Tipo público da máquina.', enum: ['Pump', 'Fan'], example: 'Pump' })
  machineType!: string;

  @ApiProperty({ description: 'Segmento de URL do ativo.', example: 'P-101' })
  slug!: string;

  @ApiProperty({ format: 'date-time', description: 'Cadastro da máquina.', example: ISO })
  createdAt!: string;

  @ApiProperty({ format: 'date-time', description: 'Última alteração do cadastro.', example: ISO })
  updatedAt!: string;

  @ApiProperty({ format: 'date-time', description: 'Início da janela.', example: ISO })
  from!: string;

  @ApiProperty({ format: 'date-time', description: 'Fim exclusivo da janela.', example: ISO })
  to!: string;

  @ApiProperty({ type: MachineKpisResponse, description: 'Indicadores do ativo na janela.' })
  kpis!: MachineKpisResponse;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Última leitura do ativo.', example: ISO })
  lastAt!: string | null;

  @ApiProperty({ type: [MachinePointSummaryResponse], description: 'Um item por ponto do ativo.' })
  points!: MachinePointSummaryResponse[];

  @ApiProperty({ type: ConditionCountsResponse, description: 'Contagem por condição ANTES do filtro.' })
  counts!: ConditionCountsResponse;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Recorte de condição aplicado aos pontos; nulo quando nenhum foi pedido.',
    enum: ['attention', 'observation', 'normal', 'unclassified', 'no-data', 'no-sensor'],
    example: 'attention',
  })
  condition!: string | null;
}

export class MachineListItemResponse {
  @ApiProperty({ format: 'uuid', description: 'Identificador da máquina.' })
  machineId!: string;

  @ApiProperty({ description: 'Nome cadastrado.', example: 'P-101' })
  machineName!: string;

  @ApiProperty({ description: 'Tipo público.', enum: ['Pump', 'Fan'], example: 'Pump' })
  machineType!: string;

  @ApiProperty({ description: 'Segmento de URL da máquina.', example: 'P-101' })
  slug!: string;

  @ApiProperty({ description: 'Pontos de monitoramento cadastrados.', example: 2 })
  pointCount!: number;

  @ApiProperty({ description: 'Pontos com sensor instalado.', example: 2 })
  sensorCount!: number;

  @ApiProperty({ description: 'Pontos em atenção ou observação.', example: 1 })
  attentionCount!: number;

  @ApiProperty({
    description: 'Condição da máquina: a pior entre os seus pontos.',
    enum: ['normal', 'observation', 'attention', 'unclassified', 'no-data', 'no-sensor'],
    example: 'attention',
  })
  condition!: string;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Última leitura conhecida.', example: ISO })
  lastAt!: string | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Maior razão observada na máquina.', example: 3.49 })
  maxDeviationRatio!: number | null;

  @ApiProperty({ type: String, nullable: true, description: 'Ponto de maior razão.', example: 'Mancal lado oposto ao acoplamento' })
  maxDeviationPoint!: string | null;
}

export class MachineListResponse {
  @ApiProperty({ format: 'date-time', description: 'Início da janela.', example: ISO })
  from!: string;

  @ApiProperty({ format: 'date-time', description: 'Fim exclusivo da janela.', example: ISO })
  to!: string;

  @ApiProperty({ type: [MachineListItemResponse], description: 'Página de máquinas.' })
  items!: MachineListItemResponse[];

  @ApiProperty({ description: 'Total após o recorte.', example: 6 })
  total!: number;

  @ApiProperty({ description: 'Página corrente (1-based).', example: 1 })
  page!: number;

  @ApiProperty({ description: 'Tamanho da página.', example: 25 })
  pageSize!: number;

  @ApiProperty({ description: 'Total de páginas.', example: 1 })
  totalPages!: number;

  @ApiProperty({ type: ConditionCountsResponse, description: 'Contagem por condição ANTES do filtro.' })
  counts!: ConditionCountsResponse;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Recorte de condição aplicado.',
    enum: ['attention', 'observation', 'normal', 'unclassified', 'no-data', 'no-sensor'],
    example: 'attention',
  })
  condition!: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'Busca aplicada ao nome da máquina.', example: 'P-10' })
  search!: string | null;

  @ApiProperty({ description: 'Coluna de ordenação.', enum: ['name', 'condition', 'deviation', 'lastAt'], example: 'name' })
  sortBy!: string;

  @ApiProperty({ description: 'Direção da ordenação.', enum: ['asc', 'desc'], example: 'asc' })
  sortDir!: string;
}

export class PointSeriesResponse {
  @ApiProperty({ format: 'uuid', description: 'Identificador da série temporal.' })
  seriesId!: string;

  @ApiProperty({
    description: 'Grandeza pública da série.',
    enum: ['acceleration', 'velocity', 'temperature', 'rotationalSpeed'],
    example: 'acceleration',
  })
  physicalQuantity!: string;

  @ApiProperty({ type: String, nullable: true, description: 'Eixo público; nulo em grandezas escalares.', enum: ['x', 'y', 'z'], example: 'y' })
  axis!: string | null;

  @ApiProperty({ description: 'Unidade da série.', example: 'g' })
  unit!: string;

  @ApiProperty({ type: Number, nullable: true, description: 'Última leitura da série na janela.', example: 0.0171 })
  lastValue!: number | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Instante da última leitura na janela.', example: ISO })
  lastAt!: string | null;
}

export class PointWindowResponse {
  @ApiProperty({ description: 'Aquisições (ciclos de ingestão) iniciadas na janela, contadas no ledger de evidência por ciclo.', example: 672 })
  acquisitionCount!: number;

  @ApiProperty({ description: 'Amostras da série âncora na janela.', example: 40320 })
  sampleCount!: number;

  @ApiProperty({ type: Number, nullable: true, description: 'Mínimo da janela.', example: 0.0121 })
  min!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Máximo da janela.', example: 0.0611 })
  max!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Média da janela.', example: 0.0187 })
  avg!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Último valor da janela.', example: 0.0171 })
  lastValue!: number | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Instante da última leitura.', example: ISO })
  lastAt!: string | null;
}

export class PointSummaryResponse {
  @ApiProperty({ format: 'uuid', description: 'Identificador da máquina.' })
  machineId!: string;

  @ApiProperty({ description: 'Nome cadastrado da máquina.', example: 'P-101' })
  machineName!: string;

  @ApiProperty({ description: 'Tipo público da máquina.', enum: ['Pump', 'Fan'], example: 'Pump' })
  machineType!: string;

  @ApiProperty({ description: 'Segmento de URL do ativo.', example: 'P-101' })
  machineSlug!: string;

  @ApiProperty({ format: 'uuid', description: 'Identificador do ponto.' })
  monitoringPointId!: string;

  @ApiProperty({ description: 'Nome do ponto.', example: 'Mancal lado oposto ao acoplamento' })
  monitoringPointName!: string;

  @ApiProperty({ description: 'Segmento de URL do ponto.', example: 'mancal-lado-oposto-ao-acoplamento' })
  slug!: string;

  @ApiProperty({ format: 'date-time', description: 'Início da janela.', example: ISO })
  from!: string;

  @ApiProperty({ format: 'date-time', description: 'Fim exclusivo da janela.', example: ISO })
  to!: string;

  @ApiProperty({ type: String, nullable: true, description: 'Sensor associado ao ponto.', example: 'SIM-HF-002' })
  sensorSerialNumber!: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'Modelo público do sensor.', example: 'HF+' })
  sensorModel!: string | null;

  @ApiProperty({
    description: 'Classificação demonstrativa do ponto.',
    enum: ['normal', 'observation', 'attention', 'unclassified', 'no-data', 'no-sensor'],
    example: 'attention',
  })
  condition!: string;

  @ApiProperty({
    description: 'Recência da última leitura.',
    enum: ['current', 'stale', 'future', 'unknown'],
    example: 'current',
  })
  freshness!: string;

  @ApiProperty({ type: Number, nullable: true, description: 'RMS radial da aquisição atual.', example: 0.0571 })
  currentValue!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'RMS radial da aquisição de referência.', example: 0.0164 })
  baselineValue!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Razão entre atual e referência.', example: 3.49 })
  deviationRatio!: number | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Instante da aquisição atual.', example: ISO })
  currentAt!: string | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Instante da aquisição de referência.', example: ISO })
  baselineAt!: string | null;

  @ApiProperty({ type: String, format: 'uuid', nullable: true, description: 'Ciclo da aquisição atual.' })
  currentCycleId!: string | null;

  @ApiProperty({ type: String, format: 'uuid', nullable: true, description: 'Ciclo da aquisição de referência.' })
  baselineCycleId!: string | null;

  @ApiProperty({ description: 'Unidade das grandezas radiais.', example: 'g' })
  unit!: string;

  @ApiProperty({ type: PointWindowResponse, description: 'Agregados da janela consultada.' })
  window!: PointWindowResponse;

  @ApiProperty({ type: [TrendPointResponse], description: 'Tendência curta do ponto.' })
  trend!: TrendPointResponse[];

  @ApiProperty({ type: [PointSeriesResponse], description: 'Séries disponíveis no ponto.' })
  series!: PointSeriesResponse[];
}

// ---------------------------------------------------------------------------------------
// Alertas — episódios persistidos (A1/A2), distintos da condição derivada
// ---------------------------------------------------------------------------------------

const ALERT_TYPE_VALUES = ['vibration-threshold', 'temperature-threshold', 'sensor-silent', 'fleet-silent'];
const ALERT_LEVEL_VALUES = ['A1', 'A2'];
const ALERT_STATE_VALUES = ['active', 'resolved'];

export class AlertRuleResponse {
  @ApiProperty({ format: 'uuid', description: 'Identificador da regra.' })
  id!: string;

  @ApiProperty({ description: 'Chave estável da regra na política.', example: 'vibration-radial' })
  key!: string;

  @ApiProperty({ enum: ALERT_TYPE_VALUES, description: 'Tipo de alerta que a regra produz.', example: 'vibration-threshold' })
  type!: string;

  @ApiProperty({ enum: ['condition', 'data-quality'], description: 'Família: condição da máquina ou qualidade do dado.', example: 'condition' })
  family!: string;

  @ApiProperty({ description: 'Regra habilitada.', example: true })
  enabled!: boolean;

  @ApiProperty({ description: 'Grandeza avaliada.', example: 'radial_rms_g' })
  metric!: string;

  @ApiProperty({ description: 'Unidade da grandeza.', example: 'g' })
  unit!: string;

  @ApiProperty({ enum: ['ratio-to-baseline', 'delta-from-baseline', 'elapsed-intervals'], description: 'Como a medida é comparada ao limiar.', example: 'ratio-to-baseline' })
  thresholdMode!: string;

  @ApiProperty({ description: 'Limiar de A1 (razão, delta ou intervalos).', example: 1.5 })
  a1Threshold!: number;

  @ApiProperty({ type: Number, nullable: true, description: 'Limiar de A2; nulo quando a regra só tem A1.', example: 2 })
  a2Threshold!: number | null;

  @ApiProperty({ description: 'Abaixo deste valor a leitura conta para resolver (histerese).', example: 1.4 })
  clearThreshold!: number;

  @ApiProperty({ description: 'Leituras consecutivas acima do limiar para abrir/escalar.', example: 2 })
  consecutiveTrigger!: number;

  @ApiProperty({ description: 'Leituras consecutivas abaixo do clear para resolver.', example: 4 })
  consecutiveClear!: number;

  @ApiProperty({ type: Number, nullable: true, description: 'Ciclos de aprendizado da baseline por ponto; nulo sem baseline.', example: 192 })
  learningCycles!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Mínimo de amostras por hora do dia para o bin ter mediana própria.', example: 4 })
  minBinCount!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Cadência esperada de aquisição, em segundos.', example: 900 })
  expectedIntervalSeconds!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Minutos de supressão após uma lacuna longa (regra térmica).', example: 120 })
  postGapSuppressionMinutes!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Fração de pontos silentes acima da qual o silêncio é da planta.', example: 0.5 })
  fleetCollapseFraction!: number | null;

  @ApiProperty({ description: 'Versão da política de alertas que a regra integra.', example: 1 })
  policyVersion!: number;
}

export class AlertReadingResponse {
  @ApiProperty({ type: String, format: 'uuid', nullable: true, description: 'Ciclo de ingestão da leitura.' })
  cycleId!: string | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Instante da leitura.', example: ISO })
  at!: string | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Valor medido (g, °C ou segundos).', example: 0.0226 })
  value!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Baseline usada na comparação, quando aplicável.', example: 0.015 })
  baseline!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Medida comparada ao limiar (razão, delta ou intervalos).', example: 1.5 })
  measure!: number | null;
}

export class AlertTriggerResponse extends AlertReadingResponse {
  @ApiProperty({ description: 'Limiar que a leitura cruzou ao abrir o episódio.', example: 1.5 })
  threshold!: number;

  @ApiProperty({ description: 'Leituras consecutivas acima do limiar quando o episódio abriu.', example: 2 })
  consecutiveEvaluations!: number;
}

export class AlertEventResponse {
  @ApiProperty({ format: 'uuid', description: 'Identificador do evento.' })
  id!: string;

  @ApiProperty({ enum: ['opened', 'escalated', 'acknowledged', 'resolved'], description: 'Transição registrada.', example: 'escalated' })
  type!: string;

  @ApiProperty({ type: String, nullable: true, enum: [...ALERT_STATE_VALUES, null], description: 'Estado anterior.', example: 'active' })
  fromState!: string | null;

  @ApiProperty({ enum: ALERT_STATE_VALUES, description: 'Estado após a transição.', example: 'active' })
  toState!: string;

  @ApiProperty({ type: String, nullable: true, enum: [...ALERT_LEVEL_VALUES, null], description: 'Nível anterior.', example: 'A1' })
  fromLevel!: string | null;

  @ApiProperty({ type: String, nullable: true, enum: [...ALERT_LEVEL_VALUES, null], description: 'Nível após a transição.', example: 'A2' })
  toLevel!: string | null;

  @ApiProperty({ format: 'date-time', description: 'Instante da transição (tempo do dado; ACK usa o relógio da API).', example: ISO })
  occurredAt!: string;

  @ApiProperty({ type: String, format: 'uuid', nullable: true, description: 'Ciclo que provocou a transição.' })
  cycleId!: string | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Valor medido no ciclo.', example: 0.0377 })
  value!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Medida comparada ao limiar.', example: 2.51 })
  measure!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Limiar envolvido.', example: 2 })
  threshold!: number | null;

  @ApiProperty({ type: String, nullable: true, description: 'E-mail de quem reconheceu (só em ACKNOWLEDGED).', example: 'analista@dynamox.local' })
  actor!: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'Nota livre.', example: 'Inspeção agendada.' })
  note!: string | null;
}

export class AlertOccurrenceResponse {
  @ApiProperty({ format: 'uuid', description: 'Identificador do episódio.' })
  id!: string;

  @ApiProperty({ format: 'uuid', description: 'Regra que o abriu.' })
  ruleId!: string;

  @ApiProperty({ description: 'Chave da regra.', example: 'vibration-radial' })
  ruleKey!: string;

  @ApiProperty({ enum: ALERT_TYPE_VALUES, description: 'Tipo do alerta — descreve a regra, nunca um diagnóstico.', example: 'vibration-threshold' })
  type!: string;

  @ApiProperty({ enum: ['condition', 'data-quality'], description: 'Família do alerta.', example: 'condition' })
  family!: string;

  @ApiProperty({ enum: ['point', 'fleet'], description: 'Escopo: um ponto monitorado ou a planta inteira.', example: 'point' })
  scope!: string;

  @ApiProperty({ enum: ALERT_LEVEL_VALUES, description: 'Nível vigente (latched: A2 permanece até resolver).', example: 'A2' })
  level!: string;

  @ApiProperty({ enum: ALERT_STATE_VALUES, description: 'Estado da anomalia.', example: 'active' })
  state!: string;

  @ApiProperty({ enum: ['open', 'acknowledged', 'resolved'], description: 'Status derivado: estado + reconhecimento.', example: 'open' })
  status!: string;

  @ApiProperty({ type: String, format: 'uuid', nullable: true, description: 'Máquina (nula no escopo de frota ou se excluída).' })
  machineId!: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'Nome da máquina no momento do alerta.', example: 'P-101' })
  machineName!: string | null;

  @ApiProperty({ type: String, nullable: true, enum: ['Pump', 'Fan', null], description: 'Tipo público da máquina, se ainda cadastrada.', example: 'Pump' })
  machineType!: string | null;

  @ApiProperty({ type: String, format: 'uuid', nullable: true, description: 'Ponto monitorado.' })
  monitoringPointId!: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'Nome do ponto no momento do alerta.', example: 'Mancal lado oposto ao acoplamento' })
  monitoringPointName!: string | null;

  @ApiProperty({ type: String, format: 'uuid', nullable: true, description: 'Sensor.' })
  sensorId!: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'Número de série do sensor no momento do alerta.', example: 'SIM-HF-002' })
  sensorSerialNumber!: string | null;

  @ApiProperty({ type: String, nullable: true, enum: ['TcAg', 'TcAs', 'HF+', null], description: 'Modelo público do sensor, se ainda cadastrado.', example: 'HF+' })
  sensorModel!: string | null;

  @ApiProperty({ format: 'date-time', description: 'Quando o episódio abriu (tempo do dado).', example: ISO })
  openedAt!: string;

  @ApiProperty({ format: 'date-time', description: 'Última leitura que atualizou o episódio.', example: ISO })
  lastEvaluatedAt!: string;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Quando foi reconhecido; nulo se não foi (ou se a escalada limpou).', example: ISO })
  acknowledgedAt!: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'E-mail de quem reconheceu.', example: 'analista@dynamox.local' })
  acknowledgedBy!: string | null;

  @ApiProperty({ type: String, nullable: true, enum: [...ALERT_LEVEL_VALUES, null], description: 'Nível vigente no reconhecimento.', example: 'A1' })
  acknowledgedLevel!: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'Nota do reconhecimento.', example: 'Inspeção agendada.' })
  acknowledgeNote!: string | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Quando resolveu; nulo enquanto ativo.', example: ISO })
  resolvedAt!: string | null;

  @ApiProperty({ type: String, nullable: true, enum: ['condition-cleared', 'telemetry-resumed', null], description: 'Por que resolveu.', example: 'condition-cleared' })
  resolutionReason!: string | null;

  @ApiProperty({ description: 'Grandeza avaliada.', example: 'radial_rms_g' })
  metric!: string;

  @ApiProperty({ description: 'Unidade da grandeza.', example: 'g' })
  unit!: string;

  @ApiProperty({ enum: ['ratio-to-baseline', 'delta-from-baseline', 'elapsed-intervals'], description: 'Como a medida é comparada.', example: 'ratio-to-baseline' })
  thresholdMode!: string;

  @ApiProperty({ type: AlertTriggerResponse, description: 'Evidência do disparo: a leitura que completou o gatilho.' })
  trigger!: AlertTriggerResponse;

  @ApiProperty({ type: AlertReadingResponse, description: 'Pior leitura do episódio.' })
  peak!: AlertReadingResponse;

  @ApiProperty({ type: AlertReadingResponse, description: 'Última leitura aplicada ao episódio.' })
  last!: AlertReadingResponse;

  @ApiProperty({ type: Number, nullable: true, description: 'Pontos cobertos por um episódio de frota; nulo no escopo de ponto.', example: 12 })
  affectedCount!: number | null;

  @ApiProperty({ description: 'Versão da política que gerou o episódio.', example: 1 })
  policyVersion!: number;
}

export class AlertBaselineResponse {
  @ApiProperty({ enum: ['learning', 'established'], description: 'Se a baseline do ponto já está comissionada.', example: 'established' })
  status!: string;

  @ApiProperty({ type: Number, nullable: true, description: 'Mediana global do período de aprendizado, na unidade da métrica.', example: 0.0156 })
  value!: number | null;

  @ApiProperty({ description: 'Ciclos com evidência já contados para o aprendizado.', example: 192 })
  learningCycles!: number;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Início da janela de aprendizado (tempo do dado).', example: ISO })
  learnedFrom!: string | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Fim da janela de aprendizado.', example: ISO })
  learnedTo!: string | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Quando a baseline passou a valer.', example: ISO })
  establishedAt!: string | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Menor contagem entre os 24 bins de hora UTC — expõe baseline esparsa.', example: 8 })
  minBinCount!: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Maior contagem entre os 24 bins de hora UTC.', example: 8 })
  maxBinCount!: number | null;

  @ApiProperty({ type: String, nullable: true, description: 'Sensor dono da baseline; trocá-lo reinicia o aprendizado.', example: 'SIM-HF-002' })
  sensorSerialNumber!: string | null;
}

export class AlertDetailResponse extends AlertOccurrenceResponse {
  @ApiProperty({ type: AlertRuleResponse, description: 'Regra aplicada, com os limiares vigentes.' })
  rule!: AlertRuleResponse;

  @ApiProperty({
    type: AlertBaselineResponse,
    nullable: true,
    description:
      'Baseline aprendida do ponto — a referência deste alerta. Nula no escopo de frota. NÃO é a referência da condição do painel (aquisição sincronizada anterior): por isso a razão do alerta e o desvio da condição podem divergir legitimamente.',
  })
  baseline!: AlertBaselineResponse | null;

  @ApiProperty({ type: [AlertEventResponse], description: 'Linha do tempo: aberto → escalado → reconhecido → resolvido.' })
  events!: AlertEventResponse[];
}

export class AlertCountsResponse {
  @ApiProperty({ description: 'Episódios no universo consultado (antes do recorte por status).', example: 14 })
  total!: number;

  @ApiProperty({ description: 'Ativos sem reconhecimento.', example: 2 })
  open!: number;

  @ApiProperty({ description: 'Ativos reconhecidos.', example: 1 })
  acknowledged!: number;

  @ApiProperty({ description: 'Resolvidos.', example: 11 })
  resolved!: number;

  @ApiProperty({ description: 'Ativos em A1.', example: 1 })
  activeA1!: number;

  @ApiProperty({ description: 'Ativos em A2.', example: 2 })
  activeA2!: number;
}

export class AlertListResponse {
  @ApiProperty({ type: [AlertOccurrenceResponse], description: 'Página de episódios.' })
  items!: AlertOccurrenceResponse[];

  @ApiProperty({ description: 'Total após o recorte por status.', example: 3 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 25 })
  pageSize!: number;

  @ApiProperty({ example: 1 })
  totalPages!: number;

  @ApiProperty({ type: AlertCountsResponse, description: 'Contagens do universo consultado, sem o recorte por status.' })
  counts!: AlertCountsResponse;

  @ApiProperty({ type: String, nullable: true, enum: ['open', 'acknowledged', 'resolved', 'active', null], description: 'Recorte por status ecoado.', example: 'active' })
  status!: string | null;

  @ApiProperty({ type: String, nullable: true, enum: [...ALERT_LEVEL_VALUES, null], description: 'Recorte por nível ecoado.', example: null })
  level!: string | null;

  @ApiProperty({ type: String, nullable: true, enum: [...ALERT_TYPE_VALUES, null], description: 'Recorte por tipo ecoado.', example: null })
  type!: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'Recorte por máquina ecoado.', example: null })
  machine!: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'Recorte por sensor ecoado.', example: null })
  sensor!: string | null;

  @ApiProperty({ type: String, nullable: true, description: 'Busca textual ecoada (sensor, máquina ou ponto).', example: null })
  search!: string | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Início da janela de interseção ecoado.', example: null })
  from!: string | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, description: 'Fim da janela de interseção ecoado.', example: null })
  to!: string | null;

  @ApiProperty({ enum: ['openedAt', 'lastEvaluatedAt', 'level'], example: 'openedAt' })
  sortBy!: string;

  @ApiProperty({ enum: ['asc', 'desc'], example: 'desc' })
  sortDir!: string;
}
