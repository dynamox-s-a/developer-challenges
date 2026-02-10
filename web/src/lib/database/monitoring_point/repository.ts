import z from 'zod'
import { MonitoringPointResponse, type IMonitoringResponse } from './presenter'
import MonitoringPoint, {
  type MonitoringPointDTO,
  MonitoringPointModel,
} from './schema'

class MonitoringPointRepository {
  async validateMonitoringPoint(dto: MonitoringPointDTO) {
    const existing = await MonitoringPoint.findOne({
      machineId: dto.MachineId,
      name: dto.Name,
    }).lean()

    if (existing) return MonitoringPointResponse(false, 'Nome já existe.')
    return MonitoringPointResponse(true, 'Validado')
  }

  async create(dto: MonitoringPointDTO): Promise<IMonitoringResponse> {
    const validation = await this.validateMonitoringPoint(dto)
    if (!validation.success) return validation
    const newMonitoringPoint = new MonitoringPoint(dto)
    const savedMonitoringPoint = await newMonitoringPoint.save()
    return MonitoringPointResponse(
      true,
      'Cadastro do ponto realizado.',
      savedMonitoringPoint.toObject() as MonitoringPointDTO,
    )
  }

  async getAllByMachine(id: string): Promise<IMonitoringResponse> {
    const response = await MonitoringPoint.find({ machine: id })
    if (!response.length)
      return MonitoringPointResponse(false, 'Nenhum dado recebido')

    const validatedData = z.array(MonitoringPointModel).safeParse(response)
    if (!validatedData.success)
      return MonitoringPointResponse(false, 'Erro ao parsear os dados')

    return MonitoringPointResponse(true, 'Dados recebidos', validatedData.data)
  }

  async update(dto: MonitoringPointDTO): Promise<IMonitoringResponse> {
    const validation = await this.validateMonitoringPoint(dto)
    if (!validation.success) return validation
    const update = await MonitoringPoint.updateOne(
      {
        machine: dto.MachineId,
        name: dto.Name,
      },
      dto,
    )
    if (!update.acknowledged)
      return MonitoringPointResponse(false, 'Erro ao realizar o update')

    return MonitoringPointResponse(true, 'Monitoring Point atualizado.')
  }

  async deleteByMachineId(id: string): Promise<IMonitoringResponse> {
    const deleted = await MonitoringPoint.deleteOne({ machine: id })
    if (!deleted.acknowledged)
      return MonitoringPointResponse(false, 'Erro ao excluir.')
    return MonitoringPointResponse(true, 'Sucesso ao excluir.')
  }
}

const monitoringPointRepository = new MonitoringPointRepository()
export default monitoringPointRepository
