using FluentValidation;
using FullStackDevelopmentChallenge.Exceptions;

using FullStackDevelopmentChallenge.Communication.Requests;

namespace FullStackDevelopmentChallenge.Application.UseCases.Machines;
public class MachineValidator : AbstractValidator<CreateMachineRequest>
{
    public MachineValidator()
    {
        RuleFor(expense => expense.Name).NotEmpty().WithMessage(ResourceErrorMessages.NAME_REQUIRED);
        RuleFor(expense => expense.SerialNumber).NotEmpty().WithMessage(ResourceErrorMessages.SERIAL_NUMBER_REQUIRED);
        RuleFor(expense => expense.MachineTypeId).NotEmpty().WithMessage(ResourceErrorMessages.MACHINE_TYPE_REQUIRED);
    }
}