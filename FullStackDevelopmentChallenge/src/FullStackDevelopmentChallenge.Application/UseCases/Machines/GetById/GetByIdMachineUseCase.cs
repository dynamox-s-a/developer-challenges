using AutoMapper;
using FullStackDevelopmentChallenge.Communication.Responses.Machines;
using FullStackDevelopmentChallenge.Domain.Repositories.Specific;
using FullStackDevelopmentChallenge.Exceptions;
using FullStackDevelopmentChallenge.Exceptions.ExeceptionsBase;

namespace FullStackDevelopmentChallenge.Application.UseCases.Machines.GetById;
public class GetByIdMachineUseCase : IGetByIdMachineUseCase
{
    private readonly IMachineRepository _machineRepository;
    private readonly IMapper _mapper;

    public GetByIdMachineUseCase(IMachineRepository machineRepository, IMapper mapper)
    {
        _machineRepository = machineRepository;
        _mapper = mapper;
    }

    public async Task<GetMachineResponse> GetById(Guid id)
    {
        var machine = await _machineRepository.GetByIdAsync(id);

        if (machine is null)
        {
            throw new NotFoundException(ResourceErrorMessages.MACHINE_NOT_FOUND);
        }

        return _mapper.Map<GetMachineResponse>(machine);
    }
}
