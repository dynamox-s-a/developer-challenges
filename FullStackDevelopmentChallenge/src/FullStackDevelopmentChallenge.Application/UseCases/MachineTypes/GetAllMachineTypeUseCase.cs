using AutoMapper;
using FullStackDevelopmentChallenge.Communication.Responses.MachineType;
using FullStackDevelopmentChallenge.Domain.Repositories.Specific;

namespace FullStackDevelopmentChallenge.Application.UseCases.MachineTypes;
public class GetAllMachineTypeUseCase : IGetAllMachineTypeUseCase
{
    private readonly IMachineTypeRepository _machineTypeRepository;
    private readonly IMapper _mapper;

    public GetAllMachineTypeUseCase(IMachineTypeRepository machineRepository, IMapper mapper)
    {
        _machineTypeRepository = machineRepository;
        _mapper = mapper;
    }
    public async Task<GetAllMachineTypeResponse> GetAllMachineType()
    {
        var result = await _machineTypeRepository.GetAllAsync();

        return new GetAllMachineTypeResponse
        {
            MachineTypes = _mapper.Map<List<GetMachineTypeResponse>>(result)
        };
    }
}
