using backend.Models;
using backend.Repositories;

namespace backend.Services
{
    /// <summary>
    /// Serviço responsável pela lógica de negócios relacionada a máquinas
    /// </summary>
    public class MachineService : IMachineService
    {
        private readonly IMachineRepository _repo;

        /// <summary>
        /// Inicializa uma nova instância do serviço de máquinas
        /// </summary>
        /// <param name="repo">Repositório de máquinas para acesso a dados</param>
        public MachineService(IMachineRepository repo)
        {
            _repo = repo ?? throw new ArgumentNullException(nameof(repo));
        }

        /// <summary>
        /// Obtém todas as máquinas cadastradas
        /// </summary>
        /// <returns>Lista de todas as máquinas</returns>
        public Task<List<Machine>> GetAllAsync() => _repo.GetAllAsync();

        /// <summary>
        /// Obtém uma máquina pelo seu ID
        /// </summary>
        /// <param name="id">ID da máquina a ser buscada</param>
        /// <returns>A máquina encontrada ou null se não existir</returns>
        public Task<Machine?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);

        /// <summary>
        /// Cria uma nova máquina no sistema
        /// </summary>
        /// <param name="machine">Dados da máquina a ser criada</param>
        /// <param name="ct">Token de cancelamento</param>
        /// <returns>A máquina criada com ID gerado</returns>
        /// <exception cref="InvalidOperationException">Lançada quando o número de série já existe</exception>
        public async Task<Machine> CreateAsync(Machine machine, CancellationToken ct = default)
        {
            // Regras simples de domínio
            if (await _repo.SerialExistsAsync(machine.SerialNumber, null, ct))
                throw new InvalidOperationException("Número de série já cadastrado.");

            machine.Id = 0;
            machine.CreatedAt = DateTime.UtcNow;
            machine.UpdatedAt = DateTime.UtcNow;
            await _repo.AddAsync(machine, ct);
            return machine;
        }

        /// <summary>
        /// Atualiza uma máquina existente
        /// </summary>
        /// <param name="id">ID da máquina a ser atualizada</param>
        /// <param name="machine">Dados atualizados da máquina</param>
        /// <param name="ct">Token de cancelamento</param>
        /// <returns>A máquina atualizada ou null se não for encontrada</returns>
        /// <exception cref="InvalidOperationException">Lançada quando o número de série já existe em outra máquina</exception>
        public async Task<Machine?> UpdateAsync(int id, Machine machine, CancellationToken ct = default)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return null;

            if (!string.Equals(existing.SerialNumber, machine.SerialNumber, StringComparison.OrdinalIgnoreCase))
            {
                if (await _repo.SerialExistsAsync(machine.SerialNumber, id, ct))
                    throw new InvalidOperationException("Número de série já cadastrado.");
            }

            existing.Name = machine.Name;
            existing.SerialNumber = machine.SerialNumber;
            existing.Description = machine.Description;
            existing.Type = machine.Type;
            existing.UpdatedAt = DateTime.UtcNow;

            await _repo.UpdateAsync(existing, ct);
            return existing;
        }

        /// <summary>
        /// Remove uma máquina do sistema
        /// </summary>
        /// <param name="id">ID da máquina a ser removida</param>
        /// <param name="ct">Token de cancelamento</param>
        /// <returns>True se a máquina foi removida, False caso contrário</returns>
        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default) 
        {
            return await _repo.DeleteAsync(id, ct);
        }
    }
}
