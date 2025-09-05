FROM mcr.microsoft.com/dotnet/sdk:9.0

WORKDIR /app

COPY Dynapredict.Api/*.csproj Dynapredict.Api/
COPY Dynapredict.Application/*.csproj Dynapredict.Application/
COPY Dynapredict.Domain/*.csproj Dynapredict.Domain/
COPY Dynapredict.Infrastructure/*.csproj Dynapredict.Infrastructure/

RUN dotnet restore Dynapredict.Api/Dynapredict.Api.csproj

COPY . .

WORKDIR /app/Dynapredict.Api

EXPOSE 5023

CMD ["dotnet", "run", "--urls", "http://0.0.0.0:5023"]
