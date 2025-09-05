using FullStackDevelopmentChallenge.Domain.Repositories;
using FullStackDevelopmentChallenge.Infraestructure.DataAccess;

namespace FullStackDevelopmentChallenge.Infrastructure.DataAcess;
public class UnitOfWork : IUnitOfWork
{
    private readonly FullStackDevelopmentChallengeDbContext _dbContext;
    public UnitOfWork(FullStackDevelopmentChallengeDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Commit() => await _dbContext.SaveChangesAsync();
}
