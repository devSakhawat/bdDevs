using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using bdDevs.Infrastructure.Entities;

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

    public virtual DbSet<CrmAdditionalDocument> CrmAdditionalDocuments { get; set; }

    public virtual DbSet<CrmAdditionalInfo> CrmAdditionalInfos { get; set; }

    public virtual DbSet<CrmApplicantCourse> CrmApplicantCourses { get; set; }

    public virtual DbSet<CrmApplicantInfo> CrmApplicantInfos { get; set; }

    public virtual DbSet<CrmApplicantReference> CrmApplicantReferences { get; set; }

    public virtual DbSet<CrmApplication> CrmApplications { get; set; }

    public virtual DbSet<CrmCountry> CrmCountries { get; set; }

    public virtual DbSet<CrmCourse> CrmCourses { get; set; }

    public virtual DbSet<CrmCourseIntake> CrmCourseIntakes { get; set; }

    public virtual DbSet<CrmCurrencyInfo> CrmCurrencyInfos { get; set; }

    public virtual DbSet<CrmEducationHistory> CrmEducationHistories { get; set; }

    public virtual DbSet<CrmGmatinformation> CrmGmatinformations { get; set; }

    public virtual DbSet<CrmIeltsinformation> CrmIeltsinformations { get; set; }

    public virtual DbSet<CrmInstitute> CrmInstitutes { get; set; }

    public virtual DbSet<CrmInstituteType> CrmInstituteTypes { get; set; }

    public virtual DbSet<CrmIntakeMonth> CrmIntakeMonths { get; set; }

    public virtual DbSet<CrmIntakeYear> CrmIntakeYears { get; set; }

    public virtual DbSet<CrmMonth> CrmMonths { get; set; }

    public virtual DbSet<CrmOthersInformation> CrmOthersInformations { get; set; }

    public virtual DbSet<CrmPaymentMethod> CrmPaymentMethods { get; set; }

    public virtual DbSet<CrmPermanentAddress> CrmPermanentAddresses { get; set; }

    public virtual DbSet<CrmPresentAddress> CrmPresentAddresses { get; set; }

    public virtual DbSet<CrmPteinformation> CrmPteinformations { get; set; }

    public virtual DbSet<CrmStatementOfPurpose> CrmStatementOfPurposes { get; set; }

    public virtual DbSet<CrmToeflinformation> CrmToeflinformations { get; set; }

    public virtual DbSet<CrmWorkExperience> CrmWorkExperiences { get; set; }

    public virtual DbSet<CrmYear> CrmYears { get; set; }

    public virtual DbSet<CurencyRate> CurencyRates { get; set; }

    public virtual DbSet<Currency> Currencies { get; set; }

    public virtual DbSet<DeligationInfo> DeligationInfos { get; set; }

    public virtual DbSet<Department> Departments { get; set; }

    public virtual DbSet<DmsDocument> DmsDocuments { get; set; }

    public virtual DbSet<DmsDocumentAccessLog> DmsDocumentAccessLogs { get; set; }

    public virtual DbSet<DmsDocumentFolder> DmsDocumentFolders { get; set; }

    public virtual DbSet<DmsDocumentTag> DmsDocumentTags { get; set; }

    public virtual DbSet<DmsDocumentTagMap> DmsDocumentTagMaps { get; set; }

    public virtual DbSet<DmsDocumentType> DmsDocumentTypes { get; set; }

    public virtual DbSet<DmsDocumentVersion> DmsDocumentVersions { get; set; }

    public virtual DbSet<DmsFileUpdateHistory> DmsFileUpdateHistories { get; set; }

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

        modelBuilder.Entity<CrmAdditionalDocument>(entity =>
        {
            entity.Property(e => e.AdditionalDocumentId).ValueGeneratedNever();
        });

        modelBuilder.Entity<CrmAdditionalInfo>(entity =>
        {
            entity.HasKey(e => e.AdditionalInfoId).HasName("PK__Addition__2C4B5286CA6080E2");

            entity.HasOne(d => d.Applicant).WithMany(p => p.CrmAdditionalInfos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Additiona__Appli__7A3223E8");
        });

        modelBuilder.Entity<CrmApplicantCourse>(entity =>
        {
            entity.HasKey(e => e.ApplicantCourseId).HasName("PK__Applican__32CD933295321BBB");

            entity.HasOne(d => d.Applicant).WithMany(p => p.CrmApplicantCourses)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Applicant__Appli__7D0E9093");
        });

        modelBuilder.Entity<CrmApplicantInfo>(entity =>
        {
            entity.HasKey(e => e.ApplicantId).HasName("PK__Applican__39AE91A8F9CF4ED3");

            entity.HasOne(d => d.Application).WithMany(p => p.CrmApplicantInfos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Applicant__Appli__7755B73D");
        });

        modelBuilder.Entity<CrmApplicantReference>(entity =>
        {
            entity.HasKey(e => e.ApplicantReferenceId).HasName("PK__Applican__8C380D2828FDEB18");

            entity.HasOne(d => d.Applicant).WithMany(p => p.CrmApplicantReferences)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Applicant__Appli__7FEAFD3E");
        });

        modelBuilder.Entity<CrmApplication>(entity =>
        {
            entity.HasKey(e => e.ApplicationId).HasName("PK__CrmAppli__C93A4C99E0194183");
        });

        modelBuilder.Entity<CrmCountry>(entity =>
        {
            entity.HasKey(e => e.CountryId).HasName("PK_Country");
        });

        modelBuilder.Entity<CrmCurrencyInfo>(entity =>
        {
            entity.HasKey(e => e.CurrencyId).HasName("PK_CurrencyInfo");
        });

        modelBuilder.Entity<CrmEducationHistory>(entity =>
        {
            entity.HasKey(e => e.EducationHistoryId).HasName("PK__Educatio__576CCA0DF8920341");

            entity.HasOne(d => d.Applicant).WithMany(p => p.CrmEducationHistories)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Education__Appli__02C769E9");
        });

        modelBuilder.Entity<CrmGmatinformation>(entity =>
        {
            entity.HasKey(e => e.GmatinformationId).HasName("PK__GMATInfo__511C53ECA7E93B59");

            entity.HasOne(d => d.Applicant).WithMany(p => p.CrmGmatinformations)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__GMATInfor__Appli__05A3D694");
        });

        modelBuilder.Entity<CrmIeltsinformation>(entity =>
        {
            entity.HasKey(e => e.IeltsinformationId).HasName("PK__IELTSInf__F3D98972BEA5442E");

            entity.HasOne(d => d.Applicant).WithMany(p => p.CrmIeltsinformations)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__IELTSInfo__Appli__0880433F");
        });

        modelBuilder.Entity<CrmInstitute>(entity =>
        {
            entity.HasKey(e => e.InstituteId).HasName("PK_CRMInstitute");
        });

        modelBuilder.Entity<CrmInstituteType>(entity =>
        {
            entity.HasKey(e => e.InstituteTypeId).HasName("PK_CRMInstituteType");
        });

        modelBuilder.Entity<CrmIntakeMonth>(entity =>
        {
            entity.ToTable("CrmIntakeMonth", tb => tb.HasComment("Stores intake months for CRM applications"));

            entity.Property(e => e.CreatedDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<CrmIntakeYear>(entity =>
        {
            entity.ToTable("CrmIntakeYear", tb => tb.HasComment("Stores intake years for CRM applications"));

            entity.Property(e => e.CreatedDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<CrmOthersInformation>(entity =>
        {
            entity.HasKey(e => e.OthersInformationId).HasName("PK__OTHERSIn__213F3EE456434251");

            entity.HasOne(d => d.Applicant).WithMany(p => p.CrmOthersInformations)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OTHERSInf__Appli__0B5CAFEA");
        });

        modelBuilder.Entity<CrmPaymentMethod>(entity =>
        {
            entity.ToTable("CrmPaymentMethod", tb => tb.HasComment("Stores payment methods available in CRM system"));

            entity.Property(e => e.CreatedDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<CrmPermanentAddress>(entity =>
        {
            entity.HasKey(e => e.PermanentAddressId).HasName("PK__Permanen__3288F26856B2B9D9");

            entity.HasOne(d => d.Applicant).WithMany(p => p.CrmPermanentAddresses)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Permanent__Appli__11158940");
        });

        modelBuilder.Entity<CrmPresentAddress>(entity =>
        {
            entity.HasKey(e => e.PresentAddressId).HasName("PK__PresentA__C0BAC2A24C5CA74C");

            entity.HasOne(d => d.Applicant).WithMany(p => p.CrmPresentAddresses)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PresentAd__Appli__13F1F5EB");
        });

        modelBuilder.Entity<CrmPteinformation>(entity =>
        {
            entity.HasKey(e => e.PteinformationId).HasName("PK__PTEInfor__1D54A2410A53FFCD");

            entity.HasOne(d => d.Applicant).WithMany(p => p.CrmPteinformations)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PTEInform__Appli__0E391C95");
        });

        modelBuilder.Entity<CrmStatementOfPurpose>(entity =>
        {
            entity.HasKey(e => e.StatementOfPurposeId).HasName("PK__Statemen__88D17C3D66DAD506");
        });

        modelBuilder.Entity<CrmToeflinformation>(entity =>
        {
            entity.HasKey(e => e.ToeflinformationId).HasName("PK__TOEFLInf__BD367513B8466628");

            entity.HasOne(d => d.Applicant).WithMany(p => p.CrmToeflinformations)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TOEFLInfo__Appli__19AACF41");
        });

        modelBuilder.Entity<CrmWorkExperience>(entity =>
        {
            entity.HasKey(e => e.WorkExperienceId).HasName("PK__WorkExpe__55A2B889125C12F5");

            entity.HasOne(d => d.Applicant).WithMany(p => p.CrmWorkExperiences)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__WorkExper__Appli__1C873BEC");
        });

        modelBuilder.Entity<DeligationInfo>(entity =>
        {
            entity.HasKey(e => e.DeligationId).HasName("PK_Deligation");
        });

        modelBuilder.Entity<Department>(entity =>
        {
            entity.Property(e => e.DepartmentId).ValueGeneratedNever();
        });

        modelBuilder.Entity<DmsDocument>(entity =>
        {
            entity.HasKey(e => e.DocumentId).HasName("PK__DMSDocum__1ABEEF0FA80AC05E");

            entity.Property(e => e.UploadDate).HasDefaultValueSql("(getdate())", "DF__DMSDocume__Uploa__02D3ED8F");

            entity.HasOne(d => d.DocumentType).WithMany(p => p.DmsDocuments)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Dmsdocument_DmsdocumentType");
        });

        modelBuilder.Entity<DmsDocumentAccessLog>(entity =>
        {
            entity.HasKey(e => e.LogId).HasName("PK__DMSDocum__5E548648EC7B75AF");

            entity.Property(e => e.AccessDateTime).HasDefaultValueSql("(getdate())", "DF__DMSDocume__Acces__1216311F");

            entity.HasOne(d => d.Document).WithMany(p => p.DmsDocumentAccessLogs)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DmsdocumentAccessLog_Dmsdocument");
        });

        modelBuilder.Entity<DmsDocumentFolder>(entity =>
        {
            entity.HasKey(e => e.FolderId).HasName("PK__DMSDocum__ACD7107FD7A53641");

            entity.HasOne(d => d.ParentFolder).WithMany(p => p.InverseParentFolder).HasConstraintName("FK_DocumentFolder_ParentFolder");
        });

        modelBuilder.Entity<DmsDocumentTag>(entity =>
        {
            entity.HasKey(e => e.TagId).HasName("PK__DMSDocum__657CF9AC43C5B9E0");
        });

        modelBuilder.Entity<DmsDocumentTagMap>(entity =>
        {
            entity.HasKey(e => e.TagMapId).HasName("PK_DMSDocumentTagMap");

            entity.HasOne(d => d.Document).WithMany(p => p.DmsDocumentTagMaps)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DmsdocumentTagMap_Dmsdocument");

            entity.HasOne(d => d.Tag).WithMany(p => p.DmsDocumentTagMaps)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DmsdocumentTagMap_DmsdocumentTag");
        });

        modelBuilder.Entity<DmsDocumentType>(entity =>
        {
            entity.HasKey(e => e.DocumentTypeId).HasName("PK__DMSDocum__DBA390E192D25821");
        });

        modelBuilder.Entity<DmsDocumentVersion>(entity =>
        {
            entity.HasKey(e => e.VersionId).HasName("PK__DMSDocum__16C6400F35C8BCE0");

            entity.Property(e => e.UploadedDate).HasDefaultValueSql("(getdate())", "DF__DMSDocume__Uploa__0E45A03B");

            entity.HasOne(d => d.Document).WithMany(p => p.DmsDocumentVersions)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DmsdocumentVersion_Dmsdocument");
        });

        modelBuilder.Entity<DmsFileUpdateHistory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DmsFileU__3214EC070B58ED2A");
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
