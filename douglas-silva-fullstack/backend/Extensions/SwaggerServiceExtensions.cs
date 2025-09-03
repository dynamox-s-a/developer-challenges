using Microsoft.OpenApi.Models;
using System.Reflection;
using backend.Filters;

namespace backend.Extensions;

public static class SwaggerServiceExtensions
{
    /// <summary>
    /// Adiciona e configura os serviços do Swagger/OpenAPI
    /// </summary>
    /// <param name="services">A coleção de serviços</param>
    /// <returns>A coleção de serviços para encadeamento</returns>
    public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo 
            { 
                Title = "DynaPredict API", 
                Version = "v1.0.0",
                Description = "API RESTful para gerenciamento de máquinas industriais.",
                Contact = new OpenApiContact
                {
                    Name = "Suporte DynaPredict",
                    Email = "suporte@dynapredict.com"
                }
            });

            var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
            var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
            
            if (File.Exists(xmlPath))
            {
                c.IncludeXmlComments(xmlPath);
            }

            c.CustomSchemaIds(type => type.FullName);
            c.SchemaFilter<EnumSchemaFilter>();
        });

        return services;
    }

    /// <summary>
    /// Configura o pipeline de requisições HTTP para usar o Swagger
    /// </summary>
    /// <param name="app">O construtor da aplicação web</param>
    /// <returns>O construtor da aplicação web para encadeamento</returns>
    public static IApplicationBuilder UseSwaggerDocumentation(this IApplicationBuilder app)
    {
        // Habilita o middleware para servir o Swagger
        app.UseSwagger();
        
        // Habilita o middleware para servir a UI do Swagger
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "DynaPredict API v1");
            c.RoutePrefix = "swagger";
        });

        return app;
    }
}
