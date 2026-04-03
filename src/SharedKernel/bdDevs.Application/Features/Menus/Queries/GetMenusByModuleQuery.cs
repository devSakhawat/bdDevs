using bdDevs.Contracts.Responses;
using bdDevs.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Application.Features.Menus.Queries;

public record GetMenusByModuleQuery(int ModuleId) : IRequest<List<MenuDto>>;

public class GetMenusByModuleQueryHandler : IRequestHandler<GetMenusByModuleQuery, List<MenuDto>>
{
    private readonly CoreDbContext _context;

    public GetMenusByModuleQueryHandler(CoreDbContext context)
    {
        _context = context;
    }

    public async Task<List<MenuDto>> Handle(GetMenusByModuleQuery query, CancellationToken cancellationToken)
    {
        var menus = await _context.Menus
            .Where(m => m.ModuleId == query.ModuleId)
            .OrderBy(m => m.Sororder)
            .ThenBy(m => m.MenuName)
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
            .ToListAsync(cancellationToken);

        return menus;
    }
}
