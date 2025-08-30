using FullStackDevelopmentChallenge.Domain.Repositories;
using FullStackDevelopmentChallenge.Infraestructure.DataAccess;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FullStackDevelopmentChallenge.Infrastructure.DataAcess.Repositories;
public class RepositoryBase<T> : IRepositoryBase<T> where T : class
{
    protected readonly FullStackDevelopmentChallengeDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public RepositoryBase(FullStackDevelopmentChallengeDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }
    public async Task CreateAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.AsNoTracking().ToListAsync();
    }

    public async Task<T> GetByIdAsync(Guid id)
    {
        return await _dbSet.FindAsync(id);
    }
}
