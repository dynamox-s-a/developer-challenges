namespace FullStackDevelopmentChallenge.Communication.Responses.MachineType;

public class GetAllMachineTypeResponse
{
    public List<GetMachineTypeResponse> MachineTypes { get; set; } = new List<GetMachineTypeResponse>();
}
