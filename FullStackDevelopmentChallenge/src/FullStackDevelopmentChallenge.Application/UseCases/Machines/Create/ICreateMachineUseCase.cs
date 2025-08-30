using FullStackDevelopmentChallenge.Communication.Requests;
using FullStackDevelopmentChallenge.Communication.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FullStackDevelopmentChallenge.Application.UseCases.Machines.Created;
public interface ICreateMachineUseCase
{
    Task<CreateMachineResponse> CreateMachine(CreateMachineRequest request);
}
