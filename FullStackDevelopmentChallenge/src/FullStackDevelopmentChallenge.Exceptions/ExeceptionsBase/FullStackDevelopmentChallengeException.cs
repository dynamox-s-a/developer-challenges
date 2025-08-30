using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FullStackDevelopmentChallenge.Exceptions.ExeceptionsBase;
public abstract class FullStackDevelopmentChallengeException : SystemException
{
    protected FullStackDevelopmentChallengeException(string message) : base(message)
    {

    }
    public abstract int StatusCode { get; }
    public abstract List<string> GetErrors();
}