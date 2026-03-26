using bdDevs.Domain.Common;
using bdDevs.Infrastructure.Entities;
using bdDevs.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options)
		: IdentityDbContext<AppUser>(options)
{
	// Auth & Shared tables
	public DbSet<UserProfile> UserProfiles { get; set; }
	public DbSet<Role> Roles { get; set; }
	public DbSet<Permission> Permissions { get; set; }
	public DbSet<UserRole> UserRoles { get; set; }
	public DbSet<RolePermission> RolePermissions { get; set; }
	public DbSet<RefreshToken> RefreshTokens { get; set; }
	public DbSet<Menu> Menus { get; set; }
	public DbSet<AuditLog> AuditLogs { get; set; }

	protected override void OnModelCreating(ModelBuilder builder)
	{
		base.OnModelCreating(builder); // Identity tables

		builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
	}

	// Audit intercept
	public override async Task<int> SaveChangesAsync(
			CancellationToken cancellationToken = default)
	{
		UpdateAuditFields();
		return await base.SaveChangesAsync(cancellationToken);
	}

	private void UpdateAuditFields()
	{
		var entries = ChangeTracker.Entries()
				.Where(e => e.State is EntityState.Added or EntityState.Modified);

		foreach (var entry in entries)
		{
			if (entry.Entity is not IAuditableEntity auditable) continue;

			var now = DateTime.UtcNow;
			if (entry.State == EntityState.Added)
				auditable.CreatedAt = now;

			auditable.ModifiedAt = now;
		}
	}
}



//using System;
//using System.Collections.Generic;
//using Microsoft.EntityFrameworkCore;
//using bdDevs.Infrastructure.Entities;

//namespace bdDevs.Infrastructure.Data;

//public partial class AppDbContext : DbContext
//{
//    public AppDbContext()
//    {
//    }

//    public AppDbContext(DbContextOptions<AppDbContext> options)
//        : base(options)
//    {
//    }

//    public virtual DbSet<AuditLog> AuditLogs { get; set; }

//    public virtual DbSet<Menu> Menus { get; set; }

//    public virtual DbSet<Permission> Permissions { get; set; }

//    public virtual DbSet<RefreshToken> RefreshTokens { get; set; }

//    public virtual DbSet<Role> Roles { get; set; }

//    public virtual DbSet<RolePermission> RolePermissions { get; set; }

//    public virtual DbSet<UserProfile> UserProfiles { get; set; }

//    public virtual DbSet<UserRole> UserRoles { get; set; }

//    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
//        => optionsBuilder.UseSqlServer("Server=DESKTOP-OMQ8M9P; User ID=sa;password=bdDevs@3011; Database=bdDevs;TrustServerCertificate=true;");

//    protected override void OnModelCreating(ModelBuilder modelBuilder)
//    {
//        modelBuilder.Entity<AuditLog>(entity =>
//        {
//            entity.HasKey(e => e.Id).HasName("PK__AuditLog__3214EC07F40EA2C5");

//            entity.Property(e => e.ChangedAt).HasDefaultValueSql("(getutcdate())");
//        });

//        modelBuilder.Entity<Menu>(entity =>
//        {
//            entity.HasKey(e => e.Id).HasName("PK__Menus__3214EC0701C1F095");

//            entity.Property(e => e.IsActive).HasDefaultValue(true);

//            entity.HasOne(d => d.Parent).WithMany(p => p.InverseParent).HasConstraintName("FK__Menus__ParentId__534D60F1");

//            entity.HasOne(d => d.Permission).WithMany(p => p.Menus).HasConstraintName("FK__Menus__Permissio__5441852A");
//        });

//        modelBuilder.Entity<Permission>(entity =>
//        {
//            entity.HasKey(e => e.Id).HasName("PK__Permissi__3214EC07139E7A0D");
//        });

//        modelBuilder.Entity<RefreshToken>(entity =>
//        {
//            entity.HasKey(e => e.Id).HasName("PK__RefreshT__3214EC0729106C24");

//            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getutcdate())");
//        });

//        modelBuilder.Entity<Role>(entity =>
//        {
//            entity.HasKey(e => e.Id).HasName("PK__Roles__3214EC07EB8528CE");

//            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getutcdate())");
//        });

//        modelBuilder.Entity<RolePermission>(entity =>
//        {
//            entity.HasKey(e => new { e.RoleId, e.PermissionId }).HasName("PK__RolePerm__6400A1A885B6FF27");

//            entity.Property(e => e.IsGranted).HasDefaultValue(true);

//            entity.HasOne(d => d.Permission).WithMany(p => p.RolePermissions).HasConstraintName("FK__RolePermi__Permi__4AB81AF0");

//            entity.HasOne(d => d.Role).WithMany(p => p.RolePermissions).HasConstraintName("FK__RolePermi__RoleI__49C3F6B7");
//        });

//        modelBuilder.Entity<UserProfile>(entity =>
//        {
//            entity.HasKey(e => e.Id).HasName("PK__UserProf__3214EC075954821D");

//            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getutcdate())");
//            entity.Property(e => e.EmploymentType).HasDefaultValue((byte)1);
//            entity.Property(e => e.Status).HasDefaultValue((byte)1);
//        });

//        modelBuilder.Entity<UserRole>(entity =>
//        {
//            entity.HasKey(e => new { e.UserProfileId, e.RoleId }).HasName("PK__UserRole__2689D383C2E4ED26");

//            entity.Property(e => e.AssignedAt).HasDefaultValueSql("(getutcdate())");

//            entity.HasOne(d => d.Role).WithMany(p => p.UserRoles).HasConstraintName("FK__UserRoles__RoleI__45F365D3");

//            entity.HasOne(d => d.UserProfile).WithMany(p => p.UserRoles).HasConstraintName("FK__UserRoles__UserP__44FF419A");
//        });

//        OnModelCreatingPartial(modelBuilder);
//    }

//    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
//}
