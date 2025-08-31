namespace FullStackDevelopmentChallenge.Communication.Responses.Machines;
public class GetAllMachinesResponse
{
    public List<GetMachineResponse> Machines { get; set; } = new List<GetMachineResponse>();
}
