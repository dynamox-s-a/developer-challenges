namespace FullStackDevelopmentChallenge.Communication.Responses;
public class GetMachineResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string SerialNumber { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string MachineType { get; set; } = null!;
}
