using FullStackDevelopmentChallenge.Communication.Responses.Machines;
using FullStackDevelopmentChallenge.Communication.Responses.MachineType;

namespace FullStackDevelopmentChallenge.Application.UseCases.MachineTypes;
public interface IGetAllMachineTypeUseCase
{
    Task<GetAllMachineTypeResponse> GetAllMachineType();
}
