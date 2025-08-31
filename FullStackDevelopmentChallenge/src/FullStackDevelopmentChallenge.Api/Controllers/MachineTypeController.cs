using FullStackDevelopmentChallenge.Application.UseCases.Machines.GetAll;
using FullStackDevelopmentChallenge.Application.UseCases.MachineTypes;
using FullStackDevelopmentChallenge.Communication.Responses.Machines;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FullStackDevelopmentChallenge.Api.Controllers;
[Route("[controller]")]
[ApiController]
public class MachineTypeController : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(GetAllMachinesResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> GetAll([FromServices] IGetAllMachineTypeUseCase useCase)
    {
        var response = await useCase.GetAllMachineType();

        if (response.MachineTypes.Count != 0)
            return Ok(response);

        return NoContent();
    }
}
