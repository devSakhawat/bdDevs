using Microsoft.EntityFrameworkCore;
using Modules.CRM.Entities;

namespace Modules.CRM.Data;

public partial class CrmDbContext : DbContext
{
  public CrmDbContext(DbContextOptions<CrmDbContext> options) : base(options)
  {
  }

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

  public virtual DbSet<DmsDocument> DmsDocuments { get; set; }

  public virtual DbSet<DmsDocumentAccessLog> DmsDocumentAccessLogs { get; set; }

  public virtual DbSet<DmsDocumentFolder> DmsDocumentFolders { get; set; }

  public virtual DbSet<DmsDocumentTag> DmsDocumentTags { get; set; }

  public virtual DbSet<DmsDocumentTagMap> DmsDocumentTagMaps { get; set; }

  public virtual DbSet<DmsDocumentType> DmsDocumentTypes { get; set; }

  public virtual DbSet<DmsDocumentVersion> DmsDocumentVersions { get; set; }

  public virtual DbSet<DmsFileUpdateHistory> DmsFileUpdateHistories { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {

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

    OnModelCreatingPartial(modelBuilder);
  }

  partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
