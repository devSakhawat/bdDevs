using bdDevs.Contracts.Responses;
using bdDevs.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Application.Features.Menus.Queries;

public record GetMenuByIdQuery(int MenuId) : IRequest<MenuDto?>;

public class GetMenuByIdQueryHandler : IRequestHandler<GetMenuByIdQuery, MenuDto?>
{
    private readonly CoreDbContext _context;

    public GetMenuByIdQueryHandler(CoreDbContext context)
    {
        _context = context;
    }

    public async Task<MenuDto?> Handle(GetMenuByIdQuery query, CancellationToken cancellationToken)
    {
        var menu = await _context.Menus
            .Where(m => m.MenuId == query.MenuId)
            .Select(m => new MenuDto
            {
                MenuId = m.MenuId,
                ModuleId = m.ModuleId,
                MenuName = m.MenuName,
                MenuPath = m.MenuPath,
                ParentMenu = m.ParentMenu,
                Sororder = m.Sororder,
                Todo = m.Todo,
                IsActive = m.IsActive
            })
            .FirstOrDefaultAsync(cancellationToken);

        return menu;
    }
}
