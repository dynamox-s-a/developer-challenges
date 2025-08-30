using Bogus;
using FullStackDevelopmentChallenge.Domain.Entities;

namespace CommonTestUtilities.Entities;
public class MachineTypeBuilder
{
    public static MachineType Build()
    {
        return new Faker<MachineType>()
            .RuleFor(u => u.Id, _ => Guid.NewGuid())
            .RuleFor(u => u.TypeName, faker => faker.PickRandom(new[]
            {
            "Press",
            "Lathe",
            "Milling Machine"
            }));
    }
}
