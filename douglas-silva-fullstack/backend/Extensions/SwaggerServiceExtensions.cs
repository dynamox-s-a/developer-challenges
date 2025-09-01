using Microsoft.OpenApi.Models;
using System.Reflection;

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
                Description = "API RESTful para gerenciamento de máquinas industriais. Fornece operações CRUD completas para gerenciar o cadastro de máquinas, incluindo seus tipos, números de série e informações adicionais.",
                Contact = new OpenApiContact
                {
                    Name = "Suporte DynaPredict",
                    Email = "suporte@dynapredict.com",
                    Url = new Uri("https://dynapredict.com/suporte")
                },
                License = new OpenApiLicense
                {
                    Name = "Licença de Uso",
                    Url = new Uri("https://dynapredict.com/licenca")
                },
                TermsOfService = new Uri("https://dynapredict.com/termos-de-uso")
            });

            // Inclui comentários XML na documentação
            var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
            var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
            c.IncludeXmlComments(xmlPath);

            // Habilita a documentação XML para tipos de esquema
            c.CustomSchemaIds(type => type.FullName);
            
            // Adiciona suporte a enums como strings na documentação
            c.DescribeAllEnumsAsStrings();
            c.EnableAnnotations();
            
            // Configura a documentação para mostrar os enums como strings
            c.SchemaFilter<EnumSchemaFilter>();
            c.DocumentFilter<EnumTypesDocumentFilter>();

            // Adiciona suporte para autenticação JWT no Swagger
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "JWT Authorization header usando o esquema Bearer.\n\n" +
                             "Digite 'Bearer' [espaço] e então seu token na caixa de texto abaixo.\n\n" +
                             "Exemplo: \"Bearer 12345abcdef\"",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer"
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement()
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        },
                        Scheme = "oauth2",
                        Name = "Bearer",
                        In = ParameterLocation.Header,
                    },
                    new List<string>()
                }
            });
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
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "DynaPredict API V1");
            c.RoutePrefix = "swagger";
            c.DocumentTitle = "DynaPredict API Documentation";
            
            // Personaliza a UI do Swagger
            c.DefaultModelsExpandDepth(-1); // Esconde os schemas por padrão
            c.DisplayRequestDuration();
            c.EnableDeepLinking();
            c.EnableFilter();
            c.ShowExtensions();
        });

        return app;
    }
}
