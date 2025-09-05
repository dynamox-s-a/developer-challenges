namespace FullStackDevelopmentChallenge.Domain.Repositories;
public interface IUnitOfWork
{
    Task Commit();
}