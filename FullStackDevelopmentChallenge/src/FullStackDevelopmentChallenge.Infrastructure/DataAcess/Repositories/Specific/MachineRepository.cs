using FullStackDevelopmentChallenge.Domain.Entities;
using FullStackDevelopmentChallenge.Domain.Repositories.Specific;
using FullStackDevelopmentChallenge.Infraestructure.DataAccess;
using System.Linq.Expressions;

namespace FullStackDevelopmentChallenge.Infrastructure.DataAcess.Repositories.Entities;
public class MachineRepository : RepositoryBase<Machine>, IMachineRepository
{
    protected override Expression<Func<Machine, object>>[] DefaultIncludes =>
        new Expression<Func<Machine, object>>[] { m => m.MachineType };
    public MachineRepository(FullStackDevelopmentChallengeDbContext context) : base(context)
    {
    }
}
