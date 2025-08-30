using Bogus;
using CommonTestUtilities.Entities;
using FullStackDevelopmentChallenge.Communication.Requests;
using FullStackDevelopmentChallenge.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonTestUtilities.Requests;
public  class CreateMachineRequestBuilder
{
    public static CreateMachineRequest Build(Guid machineTypeId, string machineTypeName)
    {
        return new Faker<CreateMachineRequest>()
            .RuleFor(user => user.Name, faker => faker.Person.FirstName)
            .RuleFor(user => user.Description, faker => faker.Commerce.ProductDescription())
            .RuleFor(user => user.MachineTypeId, faker => machineTypeId)
            .RuleFor(user => user.SerialNumber, faker =>
                $"{machineTypeName.Substring(0, 3).ToUpper()}-{faker.Random.Number(10000, 99999)}-{faker.Random.AlphaNumeric(4).ToUpper()}");
   
    }
}
