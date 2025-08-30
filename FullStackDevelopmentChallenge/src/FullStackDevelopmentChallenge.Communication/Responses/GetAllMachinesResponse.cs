namespace FullStackDevelopmentChallenge.Communication.Responses;
public class GetAllMachinesResponse
{
    public List<GetMachineResponse> Machines { get; set; } = new List<GetMachineResponse>();
}
