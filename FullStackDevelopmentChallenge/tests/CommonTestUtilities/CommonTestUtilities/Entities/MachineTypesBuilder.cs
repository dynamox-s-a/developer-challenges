using Bogus;
using FullStackDevelopmentChallenge.Domain.Entities;

namespace CommonTestUtilities.Entities;
public class MachineTypeBuilder
{
    public static List<MachineType> Collection()
    {
        var list = new List<MachineType>();

        foreach (var type in RequiredTypes)
        {
            list.Add(Build(type));
        }
        return list;
    }

    public static MachineType Build(string? forcedType = null)
    {
        return new Faker<MachineType>()
            .RuleFor(u => u.Id, _ => Guid.NewGuid())
            .RuleFor(u => u.TypeName, faker =>
                forcedType ?? faker.PickRandom(RequiredTypes));
    }

    private static readonly string[] RequiredTypes = new[]
 {
        "Press",
        "Lathe",
        "Milling Machine"
    };

}
