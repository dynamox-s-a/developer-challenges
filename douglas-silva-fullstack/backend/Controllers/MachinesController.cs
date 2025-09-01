using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using backend.Data;
using backend.Models;
using backend.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace backend.Controllers
{
    /// <summary>
    /// Controlador responsável por gerenciar as operações relacionadas a máquinas
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    [Consumes("application/json")]
    public class MachinesController : ControllerBase
    {
        private readonly IMachineService _service;

        public MachinesController(IMachineService service)
        {
            _service = service;
        }

        /// <summary>
        /// Obtém todas as máquinas cadastradas
        /// </summary>
        /// <returns>Lista de máquinas</returns>
        /// <response code="200">Retorna a lista de máquinas</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Machine>>> GetMachines()
        {
            var data = await _service.GetAllAsync();
            return Ok(data);
        }

        /// <summary>
        /// Obtém uma máquina específica pelo ID
        /// </summary>
        /// <param name="id">ID da máquina</param>
        /// <returns>Dados da máquina</returns>
        /// <response code="200">Retorna a máquina solicitada</response>
        /// <response code="404">Máquina não encontrada</response>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Machine>> GetMachine(int id)
        {
            var machine = await _service.GetByIdAsync(id);
            if (machine == null) return NotFound();
            return Ok(machine);
        }

        /// <summary>
        /// Cria uma nova máquina
        /// </summary>
        /// <param name="machine">Dados da máquina a ser criada</param>
        /// <returns>Máquina criada</returns>
        /// <response code="201">Retorna a máquina criada</response>
        /// <response code="400">Dados inválidos fornecidos</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Machine>> PostMachine(Machine machine)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _service.CreateAsync(machine);
            return CreatedAtAction(nameof(GetMachine), new { id = created.Id }, created);
        }

        /// <summary>
        /// Atualiza uma máquina existente
        /// </summary>
        /// <param name="id">ID da máquina</param>
        /// <param name="machine">Dados para atualização</param>
        /// <returns>Máquina atualizada</returns>
        /// <response code="200">Retorna a máquina atualizada</response>
        /// <response code="400">Dados inválidos</response>
        /// <response code="404">Máquina não encontrada</response>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Machine>> PutMachine(int id, Machine machine)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updated = await _service.UpdateAsync(id, machine);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        /// <summary>
        /// Exclui uma máquina existente
        /// </summary>
        /// <param name="id">ID da máquina</param>
        /// <response code="204">Exclusão realizada</response>
        /// <response code="404">Máquina não encontrada</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteMachine(int id)
        {
            var removed = await _service.DeleteAsync(id);
            if (!removed) return NotFound();
            return NoContent();
        }
    }
}