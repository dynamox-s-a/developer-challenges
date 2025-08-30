using FullStackDevelopmentChallenge.Domain.Entities;
using FullStackDevelopmentChallenge.Domain.Repositories.Specific;
using FullStackDevelopmentChallenge.Infraestructure.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FullStackDevelopmentChallenge.Infrastructure.DataAcess.Repositories.Entities;
public class MachineRepository : RepositoryBase<Machine>, IMachineRepository
{
    public MachineRepository(FullStackDevelopmentChallengeDbContext context) : base(context)
    {
    }
}
