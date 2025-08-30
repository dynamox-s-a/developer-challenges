using FullStackDevelopmentChallenge.Domain.Entities;
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

    protected virtual Expression<Func<T, object>>[] DefaultIncludes => Array.Empty<Expression<Func<T, object>>>();

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        IQueryable<T> query = _dbSet.AsNoTracking();

        // Inclui automaticamente as propriedades definidas no DefaultIncludes
        foreach (var include in DefaultIncludes)
            query = query.Include(include);

        return await query.ToListAsync();
    }

    public async Task<T?> GetByIdAsync(Guid id)
    {
        IQueryable<T> query = _dbSet.AsNoTracking();

        foreach (var include in DefaultIncludes)
            query = query.Include(include);

        return await query.FirstOrDefaultAsync(e => EF.Property<Guid>(e, "Id") == id);
    }
}
