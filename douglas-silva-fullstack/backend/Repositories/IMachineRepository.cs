using backend.Models;

namespace backend.Repositories
{
    /// <summary>
    /// Interface que define o contrato para o repositório de máquinas
    /// </summary>
    public interface IMachineRepository
    {
        /// <summary>
        /// Obtém todas as máquinas do banco de dados sem rastreamento de alterações
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
        /// Adiciona uma nova máquina ao banco de dados
        /// </summary>
        /// <param name="machine">Máquina a ser adicionada</param>
        /// <param name="ct">Token de cancelamento</param>
        /// <returns>Task que representa a operação assíncrona</returns>
        Task AddAsync(Machine machine, CancellationToken ct = default);
        /// <summary>
        /// Atualiza uma máquina existente no banco de dados
        /// </summary>
        /// <param name="machine">Máquina com os dados atualizados</param>
        /// <param name="ct">Token de cancelamento</param>
        /// <returns>Task que representa a operação assíncrona</returns>
        Task UpdateAsync(Machine machine, CancellationToken ct = default);
        /// <summary>
        /// Remove uma máquina do banco de dados
        /// </summary>
        /// <param name="id">ID da máquina a ser removida</param>
        /// <param name="ct">Token de cancelamento</param>
        /// <returns>True se a máquina foi removida, False caso contrário</returns>
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
        /// <summary>
        /// Verifica se um número de série já existe no banco de dados
        /// </summary>
        /// <param name="serialNumber">Número de série a ser verificado</param>
        /// <param name="excludingId">ID de uma máquina a ser excluída da verificação (para atualizações)</param>
        /// <param name="ct">Token de cancelamento</param>
        /// <returns>True se o número de série já existe, False caso contrário</returns>
        Task<bool> SerialExistsAsync(string serialNumber, int? excludingId = null, CancellationToken ct = default);
    }
}
