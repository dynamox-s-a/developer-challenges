namespace FullStackDevelopmentChallenge.Domain.Repositories;
public interface IRepositoryBase<T> where T : class
{
    Task<T> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task CreateAsync(T entity);
}