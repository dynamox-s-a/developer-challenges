using AutoMapper;
using FullStackDevelopmentChallenge.Application.UseCases.Machines.GetById;
using FullStackDevelopmentChallenge.Communication.Requests;
using FullStackDevelopmentChallenge.Communication.Responses.Machines;
using FullStackDevelopmentChallenge.Communication.Responses.MachineType;
using FullStackDevelopmentChallenge.Domain.Entities;

namespace FullStackDevelopmentChallenge.Application.AutoMapper;
public class AutoMapping : Profile
{
    public AutoMapping()
    {
        RequestToEntity();
        EntityToResponse();
    }
    private void RequestToEntity()
    {
        CreateMap<CreateMachineRequest, Machine>()
       .ForMember(dest => dest.Id, opt => opt.Ignore());
    }
    private void EntityToResponse()
    {
        CreateMap<Machine, CreateMachineResponse>();
        CreateMap<Machine, GetAllMachinesResponse>();
        CreateMap<Machine, GetMachineResponse>()
            .ForMember(dest => dest.MachineType, opt => opt.MapFrom(src => src.MachineType.TypeName));
        CreateMap<MachineType, GetAllMachineTypeResponse>();
        CreateMap<MachineType, GetMachineTypeResponse>();       

    }
}
