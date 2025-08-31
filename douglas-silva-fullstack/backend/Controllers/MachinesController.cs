using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using backend.Data;
using backend.Models;
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
        private readonly AppDbContext _context;

        public MachinesController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Obtém todas as máquinas cadastradas
        /// </summary>
        /// <returns>Lista de máquinas</returns>
        /// <response code="200">Retorna a lista de máquinas</response>
        // GET: api/Machines
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Machine>>> GetMachines()
        {
            return await _context.Machines.ToListAsync();
        }

        /// <summary>
        /// Obtém uma máquina específica pelo ID
        /// </summary>
        /// <param name="id">ID da máquina</param>
        /// <returns>Dados da máquina</returns>
        /// <response code="200">Retorna a máquina solicitada</response>
        /// <response code="404">Máquina não encontrada</response>
        // GET: api/Machines/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Machine>> GetMachine(int id)
        {
            var machine = await _context.Machines.FindAsync(id);

            if (machine == null)
            {
                return NotFound();
            }

            return machine;
        }

        /// <summary>
        /// Cria uma nova máquina
        /// </summary>
        /// <param name="machine">Dados da máquina a ser criada</param>
        /// <returns>Máquina criada</returns>
        /// <response code="201">Retorna a máquina criada</response>
        /// <response code="400">Dados inválidos fornecidos</response>
        // POST: api/Machines
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Machine>> PostMachine(Machine machine)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Garante que um novo ID será gerado pelo banco de dados
            machine.Id = 0;
            machine.CreatedAt = System.DateTime.UtcNow;
            machine.UpdatedAt = System.DateTime.UtcNow;
            
            _context.Machines.Add(machine);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMachine), new { id = machine.Id }, machine);
        }
    }
}