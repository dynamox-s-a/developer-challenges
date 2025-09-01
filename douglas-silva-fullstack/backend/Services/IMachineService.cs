using backend.Models;

namespace backend.Services
{
    /// <summary>
    /// Interface que define o contrato para o serviço de gerenciamento de máquinas
    /// </summary>
    public interface IMachineService
    {
        /// <summary>
        /// Obtém todas as máquinas cadastradas
        /// </summary>
        /// <returns>Lista de todas as máquinas</returns>
        Task<List<Machine>> GetAllAsync();
        /// <summary>
        /// Obtém uma máquina pelo seu ID
        /// </summary>
        /// <param name="id">ID da máquina a ser buscada</param>
        /// <returns>A máquina encontrada ou null se não existir</returns>
        Task<Machine?> GetByIdAsync(int id);
        /// <summary>
        /// Cria uma nova máquina no sistema
        /// </summary>
        /// <param name="machine">Dados da máquina a ser criada</param>
        /// <param name="ct">Token de cancelamento</param>
        /// <returns>A máquina criada com ID gerado</returns>
        /// <exception cref="InvalidOperationException">Lançada quando o número de série já existe</exception>
        Task<Machine> CreateAsync(Machine machine, CancellationToken ct = default);
        /// <summary>
        /// Atualiza uma máquina existente
        /// </summary>
        /// <param name="id">ID da máquina a ser atualizada</param>
        /// <param name="input">Dados atualizados da máquina</param>
        /// <param name="ct">Token de cancelamento</param>
        /// <returns>A máquina atualizada ou null se não for encontrada</returns>
        /// <exception cref="InvalidOperationException">Lançada quando o número de série já existe em outra máquina</exception>
        Task<Machine?> UpdateAsync(int id, Machine input, CancellationToken ct = default);
        /// <summary>
        /// Remove uma máquina do sistema
        /// </summary>
        /// <param name="id">ID da máquina a ser removida</param>
        /// <param name="ct">Token de cancelamento</param>
        /// <returns>True se a máquina foi removida, False caso contrário</returns>
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}
