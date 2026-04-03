using bdDevs.Contracts.Requests;
using bdDevs.Contracts.Responses;
using bdDevs.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Application.Features.Menus.Commands;

public record UpdateMenuCommand(UpdateMenuRequest Request) : IRequest<MenuDto?>;

public class UpdateMenuCommandHandler : IRequestHandler<UpdateMenuCommand, MenuDto?>
{
    private readonly CoreDbContext _context;

    public UpdateMenuCommandHandler(CoreDbContext context)
    {
        _context = context;
    }

    public async Task<MenuDto?> Handle(UpdateMenuCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        var menu = await _context.Menus
            .FirstOrDefaultAsync(m => m.MenuId == request.MenuId, cancellationToken);

        if (menu == null)
            return null;

        menu.ModuleId = request.ModuleId;
        menu.MenuName = request.MenuName;
        menu.MenuPath = request.MenuPath;
        menu.ParentMenu = request.ParentMenu;
        menu.Sororder = request.Sororder;
        menu.Todo = request.Todo;
        menu.IsActive = request.IsActive;

        await _context.SaveChangesAsync(cancellationToken);

        return new MenuDto
        {
            MenuId = menu.MenuId,
            ModuleId = menu.ModuleId,
            MenuName = menu.MenuName,
            MenuPath = menu.MenuPath,
            ParentMenu = menu.ParentMenu,
            Sororder = menu.Sororder,
            Todo = menu.Todo,
            IsActive = menu.IsActive
        };
    }
}
