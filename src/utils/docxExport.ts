import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  TabStopType,
  TabStopPosition,
} from 'docx';
import { saveAs } from 'file-saver';
import { CVData } from '../types/cv';

export async function exportToDocx(cv: CVData, fileName?: string): Promise<void> {
  const safeFileName = (fileName || `${cv.personalInfo.fullName.trim().replace(/\s+/g, '_')}_Resume_ATS`).concat('.docx');

  const children: Paragraph[] = [];

  // 1. Candidate Name (Header)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: (cv.personalInfo.fullName || 'YOUR NAME').toUpperCase(),
          bold: true,
          size: 32, // 16pt
          font: 'Arial',
        }),
      ],
    })
  );

  // 2. Candidate Job Title
  if (cv.personalInfo.jobTitle) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: cv.personalInfo.jobTitle,
            size: 22, // 11pt
            color: '333333',
            font: 'Arial',
          }),
        ],
      })
    );
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
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: contactParts.join('  •  '),
            size: 19, // 9.5pt
            color: '444444',
            font: 'Arial',
          }),
        ],
      })
    );
  }

  // Helper for ATS Section Heading
  const createSectionHeading = (title: string): Paragraph => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 240, after: 120 },
      border: {
        bottom: {
          color: '222222',
          space: 2,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 24, // 12pt
          font: 'Arial',
          color: '111111',
        }),
      ],
    });
  };

  // 4. Professional Summary
  if (cv.summary && cv.summary.trim().length > 0) {
    children.push(createSectionHeading('Professional Summary'));
    children.push(
      new Paragraph({
        spacing: { after: 200, line: 276 },
        children: [
          new TextRun({
            text: cv.summary,
            size: 20, // 10pt
            font: 'Arial',
            color: '222222',
          }),
        ],
      })
    );
  }

  // 5. Work Experience
  if (cv.experience && cv.experience.length > 0) {
    children.push(createSectionHeading('Work Experience'));

    cv.experience.forEach((exp) => {
      // Role Header with Company and Location
      const dateString = `${exp.startDate} – ${exp.isCurrent ? 'Present' : exp.endDate}`;

      children.push(
        new Paragraph({
          spacing: { before: 140, after: 40 },
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: TabStopPosition.MAX,
            },
          ],
          children: [
            new TextRun({
              text: exp.jobTitle || 'Job Title',
              bold: true,
              size: 21,
              font: 'Arial',
            }),
            new TextRun({
              text: '\t' + dateString,
              bold: true,
              size: 20,
              font: 'Arial',
              color: '333333',
            }),
          ],
        })
      );

      // Company and Location Subheader
      const compLoc = [exp.company, exp.location].filter(Boolean).join(' | ');
      if (compLoc) {
        children.push(
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: compLoc,
                italics: true,
                size: 20,
                font: 'Arial',
                color: '444444',
              }),
            ],
          })
        );
      }

      // Bullet Points
      exp.bullets.forEach((bullet) => {
        if (bullet.trim().length > 0) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 60, line: 260 },
              children: [
                new TextRun({
                  text: bullet,
                  size: 20,
                  font: 'Arial',
                  color: '222222',
                }),
              ],
            })
          );
        }
      });
    });
  }

  // 6. Skills Section
  if (cv.skillCategories && cv.skillCategories.length > 0) {
    children.push(createSectionHeading('Technical & Professional Skills'));

    cv.skillCategories.forEach((cat) => {
      if (cat.skills && cat.skills.length > 0) {
        children.push(
          new Paragraph({
            spacing: { after: 80, line: 260 },
            children: [
              new TextRun({
                text: `${cat.categoryName}: `,
                bold: true,
                size: 20,
                font: 'Arial',
                color: '111111',
              }),
              new TextRun({
                text: cat.skills.join(', '),
                size: 20,
                font: 'Arial',
                color: '222222',
              }),
            ],
          })
        );
      }
    });
  }

  // 7. Education Section
  if (cv.education && cv.education.length > 0) {
    children.push(createSectionHeading('Education'));

    cv.education.forEach((edu) => {
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: TabStopPosition.MAX,
            },
          ],
          children: [
            new TextRun({
              text: edu.degree || 'Degree',
              bold: true,
              size: 21,
              font: 'Arial',
            }),
            new TextRun({
              text: '\t' + (edu.graduationDate || ''),
              bold: true,
              size: 20,
              font: 'Arial',
              color: '333333',
            }),
          ],
        })
      );

      const eduSub = [edu.institution, edu.location, edu.gpa ? `GPA: ${edu.gpa}` : '']
        .filter(Boolean)
        .join(' | ');

      if (eduSub) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: eduSub,
                italics: true,
                size: 20,
                font: 'Arial',
                color: '444444',
              }),
            ],
          })
        );
      }

      if (edu.honors) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: `Honors: ${edu.honors}`,
                size: 19,
                font: 'Arial',
                color: '555555',
              }),
            ],
          })
        );
      }
    });
  }

  // 8. Projects (if any)
  if (cv.projects && cv.projects.length > 0) {
    children.push(createSectionHeading('Projects'));

    cv.projects.forEach((proj) => {
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: TabStopPosition.MAX,
            },
          ],
          children: [
            new TextRun({
              text: proj.title,
              bold: true,
              size: 21,
              font: 'Arial',
            }),
            new TextRun({
              text: proj.date ? '\t' + proj.date : '',
              bold: true,
              size: 20,
              font: 'Arial',
              color: '333333',
            }),
          ],
        })
      );

      const techLine = [proj.technologies ? `Technologies: ${proj.technologies}` : '', proj.link]
        .filter(Boolean)
        .join(' | ');

      if (techLine) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: techLine,
                italics: true,
                size: 19,
                font: 'Arial',
                color: '444444',
              }),
            ],
          })
        );
      }

      proj.bullets.forEach((bullet) => {
        if (bullet.trim()) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 60, line: 260 },
              children: [
                new TextRun({
                  text: bullet,
                  size: 20,
                  font: 'Arial',
                  color: '222222',
                }),
              ],
            })
          );
        }
      });
    });
  }

  // 9. Certifications (if any)
  if (cv.certifications && cv.certifications.length > 0) {
    children.push(createSectionHeading('Certifications'));

    cv.certifications.forEach((cert) => {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 40 },
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: TabStopPosition.MAX,
            },
          ],
          children: [
            new TextRun({
              text: cert.name,
              bold: true,
              size: 20,
              font: 'Arial',
            }),
            new TextRun({
              text: cert.date ? '\t' + cert.date : '',
              size: 19,
              font: 'Arial',
              color: '444444',
            }),
          ],
        })
      );

      if (cert.issuer) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: cert.issuer,
                italics: true,
                size: 19,
                font: 'Arial',
                color: '555555',
              }),
            ],
          })
        );
      }
    });
  }

  // Construct Document with standard margins
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.75),
              right: convertInchesToTwip(0.75),
              bottom: convertInchesToTwip(0.75),
              left: convertInchesToTwip(0.75),
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, safeFileName);
}
