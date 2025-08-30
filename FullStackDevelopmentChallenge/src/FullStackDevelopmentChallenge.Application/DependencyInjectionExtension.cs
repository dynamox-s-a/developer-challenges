using FullStackDevelopmentChallenge.Application.AutoMapper;
using FullStackDevelopmentChallenge.Application.UseCases.Machines.Created;
using FullStackDevelopmentChallenge.Application.UseCases.Machines.GetAll;
using FullStackDevelopmentChallenge.Application.UseCases.Machines.GetById;
using Microsoft.Extensions.DependencyInjection;

namespace FullStackDevelopmentChallenge.Application;

public static class DependencyInjectionExtension
{
    public static void AddApplication(this IServiceCollection services)
    {
        AddUseCase(services);
        AddAutoMapper(services);
    }
    private static void AddAutoMapper(IServiceCollection services)
    {
        services.AddAutoMapper(typeof(AutoMapping));
    }
    public static void AddUseCase(IServiceCollection services)
    {
        services.AddScoped<ICreateMachineUseCase, CreateMachineUseCase>();
        services.AddScoped<IGetAllMachinesUseCase, GetAllMachinesUseCase>();
        services.AddScoped<IGetByIdMachineUseCase, GetByIdMachineUseCase>();
    }
}
