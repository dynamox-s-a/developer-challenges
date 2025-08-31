using FullStackDevelopmentChallenge.Application.UseCases.Machines.Created;
using FullStackDevelopmentChallenge.Application.UseCases.Machines.GetAll;
using FullStackDevelopmentChallenge.Application.UseCases.Machines.GetById;
using FullStackDevelopmentChallenge.Communication.Requests;
using FullStackDevelopmentChallenge.Communication.Responses;
using FullStackDevelopmentChallenge.Communication.Responses.Machines;
using Microsoft.AspNetCore.Mvc;

namespace FullStackDevelopmentChallenge.Api.Controllers;
[Route("[controller]")]
[ApiController]
public class MachineController : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(typeof(CreateMachineResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ResponseError), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
    [FromServices] ICreateMachineUseCase useCase,
    [FromBody] CreateMachineRequest request)
    {
        var response = await useCase.CreateMachine(request);

        return Created(string.Empty, response);
    }

    [HttpGet]
    [ProducesResponseType(typeof(GetAllMachinesResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> GetAll([FromServices] IGetAllMachinesUseCase useCase)
    {
        var response = await useCase.GetAllMachines();

        if (response.Machines.Count != 0)
            return Ok(response);

        return NoContent();
    }

    [HttpGet]
    [Route("{id}")]
    [ProducesResponseType(typeof(GetMachineResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResponseError), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(
    [FromServices] IGetByIdMachineUseCase useCase,
    [FromRoute] Guid id)
    {
        var response = await useCase.GetById(id);

        return Ok(response);
    }
}
