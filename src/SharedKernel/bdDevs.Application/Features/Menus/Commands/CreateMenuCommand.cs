using bdDevs.Contracts.Requests;
using bdDevs.Contracts.Responses;
using bdDevs.Domain.Entities;
using bdDevs.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Application.Features.Menus.Commands;

public record CreateMenuCommand(CreateMenuRequest Request) : IRequest<MenuDto>;

public class CreateMenuCommandHandler : IRequestHandler<CreateMenuCommand, MenuDto>
{
    private readonly CoreDbContext _context;

    public CreateMenuCommandHandler(CoreDbContext context)
    {
        _context = context;
    }

    public async Task<MenuDto> Handle(CreateMenuCommand command, CancellationToken cancellationToken)
    {
        var request = command.Request;

        var menu = new Menu
        {
            ModuleId = request.ModuleId,
            MenuName = request.MenuName,
            MenuPath = request.MenuPath,
            ParentMenu = request.ParentMenu,
            Sororder = request.Sororder,
            Todo = request.Todo,
            IsActive = request.IsActive ?? 1
        };

        _context.Menus.Add(menu);
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
