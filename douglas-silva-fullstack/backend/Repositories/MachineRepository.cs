using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    /// <summary>
    /// Implementação do repositório para operações de banco de dados relacionadas a máquinas
    /// </summary>
    public class MachineRepository : IMachineRepository
    {
        private readonly AppDbContext _context;

        /// <summary>
        /// Inicializa uma nova instância do repositório de máquinas
        /// </summary>
        /// <param name="context">Contexto do banco de dados</param>
        public MachineRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        /// <summary>
        /// Obtém todas as máquinas do banco de dados sem rastreamento de alterações
        /// </summary>
        /// <returns>Lista de todas as máquinas</returns>
        public async Task<List<Machine>> GetAllAsync()
        {
            return await _context.Machines.AsNoTracking().ToListAsync();
        }

        /// <summary>
        /// Obtém uma máquina pelo seu ID
        /// </summary>
        /// <param name="id">ID da máquina a ser buscada</param>
        /// <returns>A máquina encontrada ou null se não existir</returns>
        public async Task<Machine?> GetByIdAsync(int id)
        {
            return await _context.Machines.FindAsync(id);
        }

        /// <summary>
        /// Adiciona uma nova máquina ao banco de dados
        /// </summary>
        /// <param name="machine">Máquina a ser adicionada</param>
        /// <param name="ct">Token de cancelamento</param>
        /// <returns>Task que representa a operação assíncrona</returns>
        public async Task AddAsync(Machine machine, CancellationToken ct = default)
        {
            await _context.Machines.AddAsync(machine, ct);
            await _context.SaveChangesAsync(ct);
        }

        /// <summary>
        /// Atualiza uma máquina existente no banco de dados
        /// </summary>
        /// <param name="machine">Máquina com os dados atualizados</param>
        /// <param name="ct">Token de cancelamento</param>
        /// <returns>Task que representa a operação assíncrona</returns>
        public async Task UpdateAsync(Machine machine, CancellationToken ct = default)
        {
            _context.Machines.Update(machine);
            await _context.SaveChangesAsync(ct);
        }

        /// <summary>
        /// Remove uma máquina do banco de dados
        /// </summary>
        /// <param name="id">ID da máquina a ser removida</param>
        /// <param name="ct">Token de cancelamento</param>
        /// <returns>True se a máquina foi removida, False caso contrário</returns>
        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var existing = await _context.Machines.FindAsync(id);
            if (existing == null) return false;
            _context.Machines.Remove(existing);
            await _context.SaveChangesAsync(ct);
            return true;
        }

        /// <summary>
        /// Verifica se um número de série já existe no banco de dados
        /// </summary>
        /// <param name="serialNumber">Número de série a ser verificado</param>
        /// <param name="excludingId">ID de uma máquina a ser excluída da verificação (para atualizações)</param>
        /// <param name="ct">Token de cancelamento</param>
        /// <returns>True se o número de série já existe, False caso contrário</returns>
        public async Task<bool> SerialExistsAsync(string serialNumber, int? excludingId = null, CancellationToken ct = default)
        {
            return await _context.Machines
                .AnyAsync(m => m.SerialNumber == serialNumber && (excludingId == null || m.Id != excludingId), ct);
        }
    }
}
