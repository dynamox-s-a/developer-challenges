/** biome-ignore-all lint/correctness/noUnusedImports: idk */
import z from 'zod'
import MonitoringPoint from './schema'
import {
  MonitoringPointPresenterSchema,
  type CreateMonitoringPointDto,
  type MonitoringPointResponse,
  type UpdateMonitoringPointDto,
} from '@/types/zod/monitoring-point'
import {
  MonitoringAnalysisPresenterSchema,
  type MonitoringAnalysisResponse,
} from '@/types/zod/monitoring-analysis'
import {
  toMonitoringAnalysisArray,
  toMonitoringPointPresenter,
  toMonitoringPointsPresenters,
} from '@/types/zod/presenter/toMonitoring'
import '../machine/schema'
import '../sensor/schema'

class MonitoringPointRepository {
  async validateMonitoringPoint(
    dto: CreateMonitoringPointDto | UpdateMonitoringPointDto,
  ): Promise<MonitoringPointResponse> {
    const existing = await MonitoringPoint.findOne({
      Machine: dto.Machine,
      Name: dto.Name,
    }).lean()

    if (existing)
      return {
        success: false,
        message: 'Já existe um monitoring point com esse nome.',
      }
    return { success: true, message: 'Monitoring point validado com sucesso' }
  }

  async getAllPopulate(): Promise<MonitoringAnalysisResponse> {
    const analyses = await MonitoringPoint.find()
      .populate('Machine')
      .populate('Sensor')

    if (!analyses.length) return { success: false, message: 'Nenhum dado' }

    const presenterData = toMonitoringAnalysisArray(analyses)
    const parsedData = z
      .array(MonitoringAnalysisPresenterSchema)
      .safeParse(presenterData)

    if (!parsedData.success)
      return { success: false, message: parsedData.error.message }

    return {
      success: true,
      message: 'Dados retornados com sucesso',
      data: parsedData.data,
    }
  }

  async create(
    dto: CreateMonitoringPointDto,
  ): Promise<MonitoringPointResponse> {
    const validation = await this.validateMonitoringPoint(dto)

    if (!validation.success) return validation
    if (dto.Sensor === '') delete dto.Sensor

    const newMonitoringPoint = new MonitoringPoint(dto)
    const savedMonitoringPoint = await newMonitoringPoint.save()
    const presenter = toMonitoringPointPresenter(savedMonitoringPoint)

    console.log(presenter)

    if (!presenter)
      return {
        success: false,
        message:
          'Erro ao realizar o parsing dos dados do ponto de monitoramento',
      }

    return {
      success: true,
      message: 'Cadastro do ponto realizado.',
      data: presenter,
    }
  }

  async getAllByMachine(id: string): Promise<MonitoringPointResponse> {
    const response = await MonitoringPoint.find({ Machine: id })
    if (!response.length)
      return { success: false, message: 'Nenhum dado recebido' }

    const validatedData = z
      .array(MonitoringPointPresenterSchema)
      .safeParse(response)
    if (!validatedData.success)
      return { success: false, message: 'Erro ao parsear os dados' }

    return {
      success: true,
      message: 'Dados recebidos',
      data: validatedData.data,
    }
  }

  async update(
    dto: UpdateMonitoringPointDto,
  ): Promise<MonitoringPointResponse> {
    if (!dto) return { success: false, message: 'Update enviado.' }
    const validation = await this.validateMonitoringPoint(dto)

    if (!validation.success) return validation

    const update = await MonitoringPoint.updateOne(
      {
        machine: dto.Machine,
        name: dto.Name,
      },
      dto,
    )

    if (!update.acknowledged)
      return { success: false, message: 'Erro ao realizar o update' }

    return { success: true, message: 'Sucesso ao atualizar os dados' }
  }

  async deleteByMachineId(id: string): Promise<MonitoringPointResponse> {
    const deleted = await MonitoringPoint.deleteOne({ Machine: id })
    if (!deleted.acknowledged)
      return { success: false, message: 'Erro ao excluir.' }
    return { success: true, message: 'Sucesso ao excluir.' }
  }
}

const monitoringPointRepository = new MonitoringPointRepository()
export default monitoringPointRepository
