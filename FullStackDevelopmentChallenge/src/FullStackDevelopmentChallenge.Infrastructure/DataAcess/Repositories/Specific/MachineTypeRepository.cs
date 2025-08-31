using FullStackDevelopmentChallenge.Domain.Entities;
using FullStackDevelopmentChallenge.Domain.Repositories.Specific;
using FullStackDevelopmentChallenge.Infraestructure.DataAccess;

namespace FullStackDevelopmentChallenge.Infrastructure.DataAcess.Repositories.Specific;
public class MachineTypeRepository : RepositoryBase<MachineType>, IMachineTypeRepository
{
    public MachineTypeRepository(FullStackDevelopmentChallengeDbContext context) : base(context)
    {
    }
}
