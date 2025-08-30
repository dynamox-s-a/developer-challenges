namespace WebApi.Test.Resources;
public class MachineHelper
{
    private readonly FullStackDevelopmentChallenge.Domain.Entities.Machine _machine;
    public MachineHelper(FullStackDevelopmentChallenge.Domain.Entities.Machine machine)
    {
       _machine = machine;  
    }

    public Guid GetId() => _machine.Id;
}
