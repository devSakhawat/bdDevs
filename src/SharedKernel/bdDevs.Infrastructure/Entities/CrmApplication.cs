using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("CrmApplication")]
public partial class CrmApplication
{
    [Key]
    public int ApplicationId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime ApplicationDate { get; set; }

    public int StateId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    public int CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    [InverseProperty("Applicant")]
    public virtual ICollection<CrmAdditionalInfo> CrmAdditionalInfos { get; set; } = new List<CrmAdditionalInfo>();

    [InverseProperty("Applicant")]
    public virtual ICollection<CrmApplicantCourse> CrmApplicantCourses { get; set; } = new List<CrmApplicantCourse>();

    [InverseProperty("Application")]
    public virtual ICollection<CrmApplicantInfo> CrmApplicantInfos { get; set; } = new List<CrmApplicantInfo>();

    [InverseProperty("Applicant")]
    public virtual ICollection<CrmApplicantReference> CrmApplicantReferences { get; set; } = new List<CrmApplicantReference>();

    [InverseProperty("Applicant")]
    public virtual ICollection<CrmEducationHistory> CrmEducationHistories { get; set; } = new List<CrmEducationHistory>();

    [InverseProperty("Applicant")]
    public virtual ICollection<CrmGmatinformation> CrmGmatinformations { get; set; } = new List<CrmGmatinformation>();

    [InverseProperty("Applicant")]
    public virtual ICollection<CrmIeltsinformation> CrmIeltsinformations { get; set; } = new List<CrmIeltsinformation>();

    [InverseProperty("Applicant")]
    public virtual ICollection<CrmOthersInformation> CrmOthersInformations { get; set; } = new List<CrmOthersInformation>();

    [InverseProperty("Applicant")]
    public virtual ICollection<CrmPermanentAddress> CrmPermanentAddresses { get; set; } = new List<CrmPermanentAddress>();

    [InverseProperty("Applicant")]
    public virtual ICollection<CrmPresentAddress> CrmPresentAddresses { get; set; } = new List<CrmPresentAddress>();

    [InverseProperty("Applicant")]
    public virtual ICollection<CrmPteinformation> CrmPteinformations { get; set; } = new List<CrmPteinformation>();

    [InverseProperty("Applicant")]
    public virtual ICollection<CrmToeflinformation> CrmToeflinformations { get; set; } = new List<CrmToeflinformation>();

    [InverseProperty("Applicant")]
    public virtual ICollection<CrmWorkExperience> CrmWorkExperiences { get; set; } = new List<CrmWorkExperience>();
}
