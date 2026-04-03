using bdDevs.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Application.Features.Menus.Commands;

public record DeleteMenuCommand(int MenuId) : IRequest<bool>;

public class DeleteMenuCommandHandler : IRequestHandler<DeleteMenuCommand, bool>
{
    private readonly CoreDbContext _context;

    public DeleteMenuCommandHandler(CoreDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteMenuCommand command, CancellationToken cancellationToken)
    {
        var menu = await _context.Menus
            .FirstOrDefaultAsync(m => m.MenuId == command.MenuId, cancellationToken);

        if (menu == null)
            return false;

        _context.Menus.Remove(menu);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
