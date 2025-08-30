namespace WebApi.Test.Resources;
public class MachineTypeHelper
{
    private readonly FullStackDevelopmentChallenge.Domain.Entities.MachineType _machineType;
    public MachineTypeHelper(FullStackDevelopmentChallenge.Domain.Entities.MachineType machineType)
    {
        _machineType = machineType;
    }

    public Guid GetId() => _machineType.Id;
    public string GetTypeName() => _machineType.TypeName;
}
