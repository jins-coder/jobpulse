import { jsPDF } from 'jspdf';
import { resumeService } from './resumeService.js';

export const pdfGeneratorService = {
  /**
   * Generates and downloads a pixel-perfect, ATS-engineered vector PDF resume
   * with automatic pagination, zero text-clipping, and full keyword fidelity.
   * 
   * @param {Object} resume - Tailored or Master Candidate Resume
   * @param {Object} job - Target Job Posting
   * @returns {string} filename
   */
  generateTailoredPdf(resume, job = null) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;
    let y = margin + 2;

    const checkPageBreak = (neededHeight) => {
      if (y + neededHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    // 1. CANDIDATE NAME (20pt Bold Clean Font)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42); // #0f172a Slate
    const name = (resume.name || 'JINSON JOSEPH').toUpperCase();
    doc.text(name, margin, y);
    y += 7;

    // 2. CONTACT SUB-ROW (8.5pt Light Slate)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105); // #475569
    const contactParts = [
      resume.email || 'jinson@example.com',
      resume.phone || '+1 (555) 019-2834',
      resume.location || 'Remote / Worldwide',
      resume.linkedin || 'linkedin.com/in/jinsonjoseph'
    ].filter(Boolean);
    doc.text(contactParts.join('   |   '), margin, y);
    y += 5.5;

    // 3. TARGET ROLE HEADLINE
    if (resume.headline || job?.title) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      const headline = resume.headline || `${job?.title || 'Senior Software Engineer'} | Modern Web & Distributed Systems`;
      doc.text(headline, margin, y);
      y += 5.5;
    }

    // Top Divider Line
    doc.setDrawColor(203, 213, 225); // #cbd5e1
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    // Section Header Helper
    const renderSectionHeader = (title) => {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(2, 132, 199); // #0284c7 Sky Blue Accent
      doc.text(title, margin, y);
      y += 1.8;
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.25);
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;
    };

    // 4. PROFESSIONAL SUMMARY (Tailored for Company)
    if (resume.summary) {
      renderSectionHeader('PROFESSIONAL SUMMARY');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const summaryLines = doc.splitTextToSize(resume.summary, contentWidth);
      checkPageBreak(summaryLines.length * 4.2 + 4);
      doc.text(summaryLines, margin, y);
      y += summaryLines.length * 4.2 + 4;
    }

    // 5. CORE TECHNICAL COMPETENCIES (With Bridged Keywords)
    const skillsList = resume.skills && resume.skills.length 
      ? resume.skills 
      : ['JavaScript', 'TypeScript', 'Vue 3', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'REST APIs'];
    renderSectionHeader('CORE TECHNICAL COMPETENCIES (ATS OPTIMIZED)');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const skillsText = skillsList.join('  •  ');
    const skillLines = doc.splitTextToSize(skillsText, contentWidth);
    checkPageBreak(skillLines.length * 4.2 + 4);
    doc.text(skillLines, margin, y);
    y += skillLines.length * 4.2 + 4;

    // 6. PROFESSIONAL WORK EXPERIENCE
    let expList = resume.experience && resume.experience.length ? resume.experience : [];
    if (expList.length === 0 && resume.rawText) {
      expList = resumeService.extractWorkExperience(resume.rawText);
    }

    if (expList.length > 0) {
      renderSectionHeader('PROFESSIONAL WORK EXPERIENCE');
      expList.forEach(exp => {
        checkPageBreak(18);

        // Role Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        const titleText = exp.title || 'Senior Software Engineer';
        doc.text(titleText, margin, y);

        // Date & Location aligned to right margin
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        const dateLoc = `${exp.period || 'Recent'}  |  ${exp.location || 'Remote'}`;
        const dateWidth = doc.getTextWidth(dateLoc);
        doc.text(dateLoc, pageWidth - margin - dateWidth, y);
        y += 4.2;

        // Company Name
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        doc.text(exp.company || 'Enterprise Solutions', margin, y);
        y += 4.8;

        // Bullets
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        const bullets = exp.highlights && exp.highlights.length ? exp.highlights : (exp.description ? [exp.description] : []);
        bullets.forEach(b => {
          const cleanB = b.replace(/^[•\-*]\s*/, '').trim();
          const bulletLines = doc.splitTextToSize(`•   ${cleanB}`, contentWidth - 4);
          checkPageBreak(bulletLines.length * 3.8 + 1);
          doc.text(bulletLines, margin + 2, y);
          y += bulletLines.length * 3.8 + 1;
        });
        y += 3;
      });
    }

    // 7. EDUCATION & CREDENTIALS
    if (resume.education && resume.education.length) {
      renderSectionHeader('EDUCATION & CREDENTIALS');
      resume.education.forEach(edu => {
        checkPageBreak(8);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        const degree = edu.degree || 'Bachelor of Science in Computer Science';
        doc.text(degree, margin, y);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        const year = edu.year ? `(${edu.year})` : '';
        const schoolText = `${edu.school || 'University'} ${year}`.trim();
        const schoolWidth = doc.getTextWidth(schoolText);
        doc.text(schoolText, pageWidth - margin - schoolWidth, y);
        y += 4.5;
      });
    }

    // 8. NOTABLE PROJECTS
    if (resume.projects && resume.projects.length) {
      renderSectionHeader('NOTABLE TECHNICAL DELIVERABLES');
      resume.projects.forEach(proj => {
        checkPageBreak(12);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(`•  ${proj.title || 'Project Architecture'}`, margin, y);
        y += 3.8;

        if (proj.description) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(71, 85, 105);
          const descLines = doc.splitTextToSize(proj.description, contentWidth - 4);
          checkPageBreak(descLines.length * 3.5);
          doc.text(descLines, margin + 4, y);
          y += descLines.length * 3.5 + 2;
        }
      });
    }

    // Save PDF
    const safeName = (resume.name || 'Candidate').replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeCompany = (job?.company || 'Company').replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeTitle = (job?.title || 'Role').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${safeName}_${safeCompany}_${safeTitle}_Resume.pdf`;

    doc.save(filename);
    return filename;
  }
};
