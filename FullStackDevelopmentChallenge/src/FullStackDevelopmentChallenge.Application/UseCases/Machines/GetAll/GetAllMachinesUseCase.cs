using AutoMapper;
using FullStackDevelopmentChallenge.Communication.Responses;
using FullStackDevelopmentChallenge.Domain.Repositories.Specific;

namespace FullStackDevelopmentChallenge.Application.UseCases.Machines.GetAll;
public class GetAllMachinesUseCase : IGetAllMachinesUseCase
{
    private readonly IMachineRepository _machineRepository;
    private readonly IMapper _mapper;

    public GetAllMachinesUseCase(IMachineRepository machineRepository, IMapper mapper)
    {
        _machineRepository = machineRepository;
        _mapper = mapper;
    }

    public async Task<GetAllMachinesResponse> GetAllMachines()
    {
        var result = await _machineRepository.GetAllAsync(m => m.MachineType);

        return new GetAllMachinesResponse
        {
            Machines = _mapper.Map<List<GetMachineResponse>>(result)
        };
    }
}
