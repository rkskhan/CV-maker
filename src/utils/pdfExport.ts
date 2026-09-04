import { jsPDF } from 'jspdf';
import { CVData } from '../types/cv';

export function exportToPdf(cv: CVData, fileName?: string): void {
  const safeFileName = (fileName || `${cv.personalInfo.fullName.trim().replace(/\s+/g, '_')}_Resume_ATS`).concat('.pdf');

  // Create standard US Letter portrait PDF (width: 215.9mm / 8.5in, height: 279.4mm / 11in)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 45; // 0.625 inch margins for clean spacing
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // 1. Candidate Full Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(20, 20, 20);
  const fullName = (cv.personalInfo.fullName || 'YOUR NAME').toUpperCase();
  doc.text(fullName, pageWidth / 2, y, { align: 'center' });
  y += 18;

  // 2. Job Title
  if (cv.personalInfo.jobTitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(cv.personalInfo.jobTitle, pageWidth / 2, y, { align: 'center' });
    y += 16;
  }

  // 3. Contact Line
  const contactParts: string[] = [];
  if (cv.personalInfo.email) contactParts.push(cv.personalInfo.email);
  if (cv.personalInfo.phone) contactParts.push(cv.personalInfo.phone);
  if (cv.personalInfo.location) contactParts.push(cv.personalInfo.location);
  if (cv.personalInfo.linkedinUrl) contactParts.push(cv.personalInfo.linkedinUrl);
  if (cv.personalInfo.githubUrl) contactParts.push(cv.personalInfo.githubUrl);
  if (cv.personalInfo.websiteUrl) contactParts.push(cv.personalInfo.websiteUrl);

  if (contactParts.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    const contactText = contactParts.join('  •  ');
    // Wrap contact if too wide
    const wrappedContact = doc.splitTextToSize(contactText, contentWidth);
    wrappedContact.forEach((line: string) => {
      doc.text(line, pageWidth / 2, y, { align: 'center' });
      y += 11;
    });
    y += 6;
  }

  // Section Heading Renderer
  const renderSectionHeader = (title: string) => {
    checkPageBreak(35);
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(20, 20, 20);
    doc.text(title.toUpperCase(), margin, y);
    y += 4;
    // Clean crisp divider line
    doc.setDrawColor(50, 50, 50);
    doc.setLineWidth(0.75);
    doc.line(margin, y, pageWidth - margin, y);
    y += 14;
  };

  // 4. Professional Summary
  if (cv.summary && cv.summary.trim().length > 0) {
    renderSectionHeader('Professional Summary');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    const lines = doc.splitTextToSize(cv.summary, contentWidth);
    lines.forEach((line: string) => {
      checkPageBreak(13);
      doc.text(line, margin, y);
      y += 12.5;
    });
    y += 6;
  }

  // 5. Work Experience
  if (cv.experience && cv.experience.length > 0) {
    renderSectionHeader('Work Experience');

    cv.experience.forEach((exp) => {
      checkPageBreak(40);
      const dateStr = `${exp.startDate} – ${exp.isCurrent ? 'Present' : exp.endDate}`;

      // Line 1: Job Title (left, bold) and Date (right, bold)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
      doc.text(exp.jobTitle || 'Job Title', margin, y);
      doc.setFont('helvetica', 'bold');
      doc.text(dateStr, pageWidth - margin, y, { align: 'right' });
      y += 12;

      // Line 2: Company & Location (italic/gray)
      const compLoc = [exp.company, exp.location].filter(Boolean).join(' | ');
      if (compLoc) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9.5);
        doc.setTextColor(70, 70, 70);
        doc.text(compLoc, margin, y);
        y += 12;
      }

      // Bullets
      exp.bullets.forEach((bullet) => {
        if (!bullet.trim()) return;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(30, 30, 30);

        const bulletIndent = 12;
        const bulletWidth = contentWidth - bulletIndent;
        const wrapped = doc.splitTextToSize(bullet, bulletWidth);

        checkPageBreak(wrapped.length * 11 + 4);
        // Draw standard bullet circle/symbol
        doc.text('•', margin + 2, y);

        wrapped.forEach((bLine: string, index: number) => {
          doc.text(bLine, margin + bulletIndent, y);
          y += 11.5;
        });
        y += 2;
      });

      y += 6;
    });
  }

  // 6. Skills Section
  if (cv.skillCategories && cv.skillCategories.length > 0) {
    renderSectionHeader('Technical & Professional Skills');

    cv.skillCategories.forEach((cat) => {
      if (!cat.skills || cat.skills.length === 0) return;
      checkPageBreak(24);

      const categoryLabel = `${cat.categoryName}: `;
      const skillsString = cat.skills.join(', ');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(20, 20, 20);
      const labelWidth = doc.getTextWidth(categoryLabel);

      const fullText = categoryLabel + skillsString;
      const wrapped = doc.splitTextToSize(fullText, contentWidth);

      wrapped.forEach((line: string, lineIndex: number) => {
        checkPageBreak(12);
        if (lineIndex === 0) {
          doc.setFont('helvetica', 'bold');
          doc.text(categoryLabel, margin, y);
          doc.setFont('helvetica', 'normal');
          doc.text(line.substring(categoryLabel.length), margin + labelWidth, y);
        } else {
          doc.setFont('helvetica', 'normal');
          doc.text(line, margin, y);
        }
        y += 12;
      });
      y += 2;
    });
    y += 6;
  }

  // 7. Education
  if (cv.education && cv.education.length > 0) {
    renderSectionHeader('Education');

    cv.education.forEach((edu) => {
      checkPageBreak(30);

      // Line 1: Degree & Graduation Date
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
      doc.text(edu.degree || 'Degree', margin, y);
      if (edu.graduationDate) {
        doc.text(edu.graduationDate, pageWidth - margin, y, { align: 'right' });
      }
      y += 12;

      // Line 2: Institution & Location
      const eduSub = [edu.institution, edu.location, edu.gpa ? `GPA: ${edu.gpa}` : '']
        .filter(Boolean)
        .join(' | ');

      if (eduSub) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9.5);
        doc.setTextColor(70, 70, 70);
        doc.text(eduSub, margin, y);
        y += 11;
      }

      if (edu.honors) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.text(`Honors: ${edu.honors}`, margin, y);
        y += 11;
      }
      y += 4;
    });
  }

  // 8. Projects
  if (cv.projects && cv.projects.length > 0) {
    renderSectionHeader('Projects');

    cv.projects.forEach((proj) => {
      checkPageBreak(30);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
      doc.text(proj.title, margin, y);
      if (proj.date) {
        doc.text(proj.date, pageWidth - margin, y, { align: 'right' });
      }
      y += 12;

      const techLine = [proj.technologies ? `Technologies: ${proj.technologies}` : '', proj.link]
        .filter(Boolean)
        .join(' | ');

      if (techLine) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(70, 70, 70);
        doc.text(techLine, margin, y);
        y += 11;
      }

      proj.bullets.forEach((bullet) => {
        if (!bullet.trim()) return;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(30, 30, 30);

        const bulletIndent = 12;
        const bulletWidth = contentWidth - bulletIndent;
        const wrapped = doc.splitTextToSize(bullet, bulletWidth);

        checkPageBreak(wrapped.length * 11 + 4);
        doc.text('•', margin + 2, y);

        wrapped.forEach((bLine: string) => {
          doc.text(bLine, margin + bulletIndent, y);
          y += 11.5;
        });
        y += 2;
      });
      y += 4;
    });
  }

  // 9. Certifications
  if (cv.certifications && cv.certifications.length > 0) {
    renderSectionHeader('Certifications');

    cv.certifications.forEach((cert) => {
      checkPageBreak(24);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(20, 20, 20);
      doc.text(cert.name, margin, y);
      if (cert.date) {
        doc.setFont('helvetica', 'normal');
        doc.text(cert.date, pageWidth - margin, y, { align: 'right' });
      }
      y += 11;

      if (cert.issuer) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(70, 70, 70);
        doc.text(cert.issuer, margin, y);
        y += 11;
      }
      y += 2;
    });
  }

  doc.save(safeFileName);
}
