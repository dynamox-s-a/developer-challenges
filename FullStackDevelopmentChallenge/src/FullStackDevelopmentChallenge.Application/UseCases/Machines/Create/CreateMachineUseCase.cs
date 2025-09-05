using AutoMapper;
using FullStackDevelopmentChallenge.Communication.Requests;
using FullStackDevelopmentChallenge.Communication.Responses.Machines;
using FullStackDevelopmentChallenge.Domain.Entities;
using FullStackDevelopmentChallenge.Domain.Repositories;
using FullStackDevelopmentChallenge.Domain.Repositories.Specific;
using FullStackDevelopmentChallenge.Exceptions.ExeceptionsBase;

namespace FullStackDevelopmentChallenge.Application.UseCases.Machines.Created;
public class CreateMachineUseCase : ICreateMachineUseCase
{
    private readonly IMachineRepository _machineRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateMachineUseCase(IMachineRepository machineRepository, IUnitOfWork unitOfWork, IMapper mapper)
    {
        _machineRepository = machineRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<CreateMachineResponse> CreateMachine(CreateMachineRequest request)
    {
        this.Validate(request);

        var machine = _mapper.Map<Machine>(request);
        machine.Id = Guid.NewGuid();

        await _machineRepository.CreateAsync(machine);
        await _unitOfWork.Commit();

        return _mapper.Map<CreateMachineResponse>(machine);
    }

    private void Validate(CreateMachineRequest request)
    {
        var validator = new MachineValidator();

        var result = validator.Validate(request);

        if (result.IsValid == false)
        {
            var errorMessages = result.Errors.Select(f => f.ErrorMessage).ToList();

            throw new ErrorOnValidationException(errorMessages);
        }
    }
}
