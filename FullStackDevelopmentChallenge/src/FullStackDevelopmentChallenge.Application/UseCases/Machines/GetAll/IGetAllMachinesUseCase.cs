using FullStackDevelopmentChallenge.Communication.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FullStackDevelopmentChallenge.Application.UseCases.Machines.GetAll;
public interface IGetAllMachinesUseCase
{
    Task<GetAllMachinesResponse> GetAllMachines();
}
