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

    public async Task<IEnumerable<T>> GetAllAsync(params Expression<Func<T, object>>[] includes)
    {
        IQueryable<T> query = _dbSet.AsNoTracking();

        foreach (var include in includes)
        {
            query = query.Include(include);
        }

        return await query.ToListAsync();
    }
    public async Task<T> GetByIdAsync(Guid id, params Expression<Func<T, object>>[] includes)
    {
        IQueryable<T> query = _dbSet.AsNoTracking();

        foreach (var include in includes)
            query = query.Include(include);

        return await query.FirstOrDefaultAsync(e => EF.Property<Guid>(e, "Id") == id);
    }
}
