using Dynapredict.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Dynapredict.Infrastructure;

namespace Dynapredict.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MachinesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MachinesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Machine>>> GetMachines()
        {
            return await _context.Machines.Include(m => m.MachineType).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Machine>> GetMachine(Guid id)
        {
            var machine = await _context.Machines
                .Include(m => m.MachineType)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (machine == null)
                return NotFound();

            return Ok(machine);
        }

        [HttpPost]
        public async Task<ActionResult<Machine>> CreateMachine(Machine machine)
        {
            bool exists = await _context.Machines
                .AnyAsync(m => m.SerialNumber == machine.SerialNumber);

            if (exists)
            {
                return Conflict(new { message = "Já existe uma máquina com esse número de série." });
            }

            machine.Id = Guid.NewGuid();
            _context.Machines.Add(machine);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMachine), new { id = machine.Id }, machine);
        }
    }
}
