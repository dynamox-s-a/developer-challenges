using FullStackDevelopmentChallenge.Application.UseCases.Machines.Created;
using FullStackDevelopmentChallenge.Communication.Requests;
using FullStackDevelopmentChallenge.Communication.Responses;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FullStackDevelopmentChallenge.Api.Controllers;
[Route("[controller]")]
[ApiController]
public class MachineController : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(typeof(CreateMachineResponse), StatusCodes.Status201Created)]
    //[ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register(
    [FromServices] ICreateMachineUseCase useCase,
    [FromBody] CreateMachineRequest request)
    {
        var response = await useCase.CreateMachine(request);

        return Created(string.Empty, response);
    }
}
