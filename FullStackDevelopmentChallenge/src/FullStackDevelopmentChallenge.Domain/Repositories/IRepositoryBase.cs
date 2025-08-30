using System.Linq.Expressions;

namespace FullStackDevelopmentChallenge.Domain.Repositories;
public interface IRepositoryBase<T> where T : class
{
    Task<T> GetByIdAsync(Guid id, params Expression<Func<T, object>>[] includes);
    Task<IEnumerable<T>> GetAllAsync(params Expression<Func<T, object>>[] includes);
    Task CreateAsync(T entity);
}