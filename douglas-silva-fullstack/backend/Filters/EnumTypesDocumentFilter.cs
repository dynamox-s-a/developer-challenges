using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Linq;
using System.Reflection;

namespace backend.Filters
{
    /// <summary>
    /// Filtro para documentar os tipos de enum na documentação do Swagger
    /// </summary>
    public class EnumTypesDocumentFilter : IDocumentFilter
    {
        /// <summary>
        /// Aplica o filtro ao documento do Swagger
        /// </summary>
        public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
        {
            // Obtém todos os tipos de enum do assembly
            var enumTypes = context.SchemaRepository.Schemas
                .Where(x => x.Value.Enum != null && x.Value.Enum.Count > 0)
                .ToDictionary(x => x.Key, x => x.Value);

            foreach (var enumType in enumTypes)
            {
                var schema = enumType.Value;
                var enumName = enumType.Key;
                
                // Adiciona descrição ao esquema do enum
                var type = AppDomain.CurrentDomain.GetAssemblies()
                    .SelectMany(x => x.GetTypes())
                    .FirstOrDefault(x => x.Name == enumName);

                if (type != null && type.IsEnum)
                {
                    var enumValues = Enum.GetNames(type)
                        .Select(name => new { 
                            Name = name, 
                            Value = (int)Enum.Parse(type, name) 
                        });

                    // Adiciona descrição com os valores do enum
                    var description = string.Join("\n", 
                        enumValues.Select(x => $"{x.Value} - {x.Name}"));
                    
                    schema.Description = $"Valores possíveis:\n{description}";
                }
            }
        }
    }
}
