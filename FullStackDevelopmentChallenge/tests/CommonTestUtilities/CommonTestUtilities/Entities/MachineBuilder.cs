using Bogus;
using FullStackDevelopmentChallenge.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonTestUtilities.Entities;
public class MachineBuilder
{
    public static Machine Build(MachineType machineType)
    {
        return new Faker<Machine>()
            .RuleFor(u => u.Id, _ => Guid.NewGuid())
            .RuleFor(u => u.Name, faker => faker.Commerce.ProductName())
            .RuleFor(r => r.Description, faker => faker.Commerce.ProductDescription())
            .RuleFor(r => r.MachineTypeId, machineType.Id)
            .RuleFor(user => user.SerialNumber, faker =>
                $"{machineType.TypeName.Substring(0, 3).ToUpper()}-{faker.Random.Number(10000, 99999)}-{faker.Random.AlphaNumeric(4).ToUpper()}");    
    }
}
