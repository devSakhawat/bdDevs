using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using bdDevs.Domain.Entities;

namespace bdDevs.Infrastructure.Data;

public partial class CoreDbContext : DbContext
{
    public CoreDbContext(DbContextOptions<CoreDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AboutUsLicense> AboutUsLicenses { get; set; }

    public virtual DbSet<AccessControl> AccessControls { get; set; }

    public virtual DbSet<AccessRestriction> AccessRestrictions { get; set; }

    public virtual DbSet<ApproverDetail> ApproverDetails { get; set; }

    public virtual DbSet<ApproverHistory> ApproverHistories { get; set; }

    public virtual DbSet<ApproverOrder> ApproverOrders { get; set; }

    public virtual DbSet<ApproverType> ApproverTypes { get; set; }

    public virtual DbSet<ApproverTypeToGroupMapping> ApproverTypeToGroupMappings { get; set; }

    public virtual DbSet<AppsTokenInfo> AppsTokenInfos { get; set; }

    public virtual DbSet<AppsTransactionLog> AppsTransactionLogs { get; set; }

    public virtual DbSet<AssemblyInfo> AssemblyInfos { get; set; }

    public virtual DbSet<AssignApprover> AssignApprovers { get; set; }

    public virtual DbSet<AuditLog> AuditLogs { get; set; }

    public virtual DbSet<AuditTrail> AuditTrails { get; set; }

    public virtual DbSet<AuditType> AuditTypes { get; set; }

    public virtual DbSet<BoardInstitute> BoardInstitutes { get; set; }

    public virtual DbSet<Branch> Branches { get; set; }

    public virtual DbSet<Company> Companies { get; set; }

    public virtual DbSet<CompanyDepartmentMap> CompanyDepartmentMaps { get; set; }

    public virtual DbSet<CompanyLocationMap> CompanyLocationMaps { get; set; }

    public virtual DbSet<Competency> Competencies { get; set; }

    public virtual DbSet<CompetencyLevel> CompetencyLevels { get; set; }

    public virtual DbSet<CurencyRate> CurencyRates { get; set; }

    public virtual DbSet<Currency> Currencies { get; set; }

    public virtual DbSet<DeligationInfo> DeligationInfos { get; set; }

    public virtual DbSet<Department> Departments { get; set; }

    public virtual DbSet<Docmdetail> Docmdetails { get; set; }

    public virtual DbSet<Docmdetailshistory> Docmdetailshistories { get; set; }

    public virtual DbSet<Documanttype> Documanttypes { get; set; }

    public virtual DbSet<Document> Documents { get; set; }

    public virtual DbSet<DocumentParameter> DocumentParameters { get; set; }

    public virtual DbSet<DocumentParameterMapping> DocumentParameterMappings { get; set; }

    public virtual DbSet<DocumentQueryMapping> DocumentQueryMappings { get; set; }

    public virtual DbSet<DocumentTemplate> DocumentTemplates { get; set; }

    public virtual DbSet<Employee> Employees { get; set; }

    public virtual DbSet<Employeetype> Employeetypes { get; set; }

    public virtual DbSet<Employment> Employments { get; set; }

    public virtual DbSet<Group> Groups { get; set; }

    public virtual DbSet<GroupMember> GroupMembers { get; set; }

    public virtual DbSet<GroupPermission> GroupPermissions { get; set; }

    public virtual DbSet<Holiday> Holidays { get; set; }

    public virtual DbSet<MaritalStatus> MaritalStatuses { get; set; }

    public virtual DbSet<Menu> Menus { get; set; }

    public virtual DbSet<Module> Modules { get; set; }

    public virtual DbSet<PasswordHistory> PasswordHistories { get; set; }

    public virtual DbSet<RefreshToken> RefreshTokens { get; set; }

    public virtual DbSet<ReportBuilder> ReportBuilders { get; set; }

    public virtual DbSet<SystemSetting> SystemSettings { get; set; }

    public virtual DbSet<Thana> Thanas { get; set; }

    public virtual DbSet<Timesheet> Timesheets { get; set; }

    public virtual DbSet<TokenBlacklist> TokenBlacklists { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<WfAction> WfActions { get; set; }

    public virtual DbSet<WfState> WfStates { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AboutUsLicense>(entity =>
        {
            entity.Property(e => e.AboutUsLicenseId).ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<AccessControl>(entity =>
        {
            entity.HasKey(e => e.AccessId).HasName("PK_ACCESSCONTROL");
        });

        modelBuilder.Entity<ApproverDetail>(entity =>
        {
            entity.HasKey(e => e.RemarksId).HasName("PK_Remarks");
        });

        modelBuilder.Entity<ApproverOrder>(entity =>
        {
            entity.Property(e => e.ApproverOrderId).ValueGeneratedNever();
        });

        modelBuilder.Entity<ApproverType>(entity =>
        {
            entity.Property(e => e.ApproverTypeId).ValueGeneratedNever();
        });

        modelBuilder.Entity<ApproverTypeToGroupMapping>(entity =>
        {
            entity.Property(e => e.ApproverTypeMapId).ValueGeneratedOnAdd();

            entity.HasOne(d => d.ApproverType).WithMany().HasConstraintName("FK_ApproverTypeToGroupMapping_ApproverType");
        });

        modelBuilder.Entity<AppsTransactionLog>(entity =>
        {
            entity.Property(e => e.TransactionLogId).ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<AssemblyInfo>(entity =>
        {
            entity.Property(e => e.AssemblyInfoId)
                .ValueGeneratedNever()
                .HasComment("");
            entity.Property(e => e.IsAttendanceByLogin).HasComment("false=Attedance by login inactive feature");
        });

        modelBuilder.Entity<AssignApprover>(entity =>
        {
            entity.Property(e => e.AssignApproverId).ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.Property(e => e.AuditId).ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<AuditTrail>(entity =>
        {
            entity.Property(e => e.AuditId).ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<CompanyDepartmentMap>(entity =>
        {
            entity.Property(e => e.SbuDepartmentMapId).ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<CompanyLocationMap>(entity =>
        {
            entity.Property(e => e.SbuLocationMapId).ValueGeneratedOnAdd();
        });


        modelBuilder.Entity<DeligationInfo>(entity =>
        {
            entity.HasKey(e => e.DeligationId).HasName("PK_Deligation");
        });

        modelBuilder.Entity<Department>(entity =>
        {
            entity.Property(e => e.DepartmentId).ValueGeneratedNever();
        });

        modelBuilder.Entity<Docmdetailshistory>(entity =>
        {
            entity.Property(e => e.Lastupdate).HasDefaultValueSql("(getdate())", "DF__DOCMDETAI__LASTU__2EA5EC27");
        });

        modelBuilder.Entity<Documanttype>(entity =>
        {
            entity.Property(e => e.UseType)
                .HasComment("1=Personal Document,2=Applicant Document")
                .HasDefaultValue(1, "DF_DOCUMANTTYPE_UseType");
        });

        modelBuilder.Entity<DocumentParameterMapping>(entity =>
        {
            entity.Property(e => e.IsVisible).HasDefaultValue(true);
            entity.Property(e => e.MappingId).ValueGeneratedOnAdd();

            entity.HasOne(d => d.DocumentType).WithMany().HasConstraintName("FK_DocumentParameterMapping_DOCUMANTTYPE");

            entity.HasOne(d => d.Parameter).WithMany().HasConstraintName("FK_DocumentParameterMapping_DocumentParameter");
        });

        modelBuilder.Entity<Employeetype>(entity =>
        {
            entity.Property(e => e.IsContract).HasDefaultValue(false);
        });

        modelBuilder.Entity<Employment>(entity =>
        {
            entity.Property(e => e.HrrecordId).ValueGeneratedNever();
        });

        modelBuilder.Entity<MaritalStatus>(entity =>
        {
            entity.Property(e => e.MaritalStatusId).ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.RefreshTokenId).HasName("PK__RefreshT__F5845E3997C19564");
        });

        modelBuilder.Entity<SystemSetting>(entity =>
        {
            entity.Property(e => e.IsWebLoginEnable)
                .HasComment("0=Disable,1=Enable")
                .HasDefaultValue(0, "DF__SystemSet__IsWeb__2B9F624A");
            entity.Property(e => e.OdbcClientList).HasComment("0=Native SQL, 1=ODBC");
            entity.Property(e => e.PassResetBy).HasComment("1=SysAdmin, 2=User");
            entity.Property(e => e.PassType).HasComment("1=Alphanumeric, 2=Alphabetic, 3=Numeric");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK_User");

            entity.Property(e => e.EmployeeId).HasComment("EmployeeId As HrRecordId");
        });

        modelBuilder.Entity<WfAction>(entity =>
        {
            entity.HasKey(e => e.WfactionId).HasName("PK_WFAction");
        });

        modelBuilder.Entity<WfState>(entity =>
        {
            entity.HasKey(e => e.WfstateId).HasName("PK_WFState");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
