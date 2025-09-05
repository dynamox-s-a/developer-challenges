namespace FullStackDevelopmentChallenge.Communication.Requests;

public class CreateMachineRequest
{

    public string Name { get; set; } = null!;

    public string SerialNumber { get; set; } = null!;

    public string Description { get; set; } = null!;

    public Guid MachineTypeId { get; set; }
}
