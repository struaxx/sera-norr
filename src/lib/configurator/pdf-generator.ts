// ============================================
// SERA NORR Dossier PDF Generator
// ============================================

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { ConfiguratorState } from './types';
import { getStoneById } from './stone-library';
import { getLegById } from './leg-library';
import { SHAPES, FINISHES, EDGE_PROFILES, BASES } from './config';
import { calculateModularPrice, getModularLeadTime, formatVanafPrice } from './pricing-v2';

interface PDFGeneratorOptions {
  config: ConfiguratorState;
  buildCode: string;
  customStoneRequest?: string;
  viewerElement?: HTMLElement | null;
  isNL?: boolean;
}

export async function generateDossierPDF({
  config,
  buildCode,
  customStoneRequest,
  viewerElement,
  isNL = true,
}: PDFGeneratorOptions): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // Colors (SERA NORR brand)
  const brandDark = '#1a1a1a';
  const brandMuted = '#666666';
  const brandLight = '#f5f5f5';

  // Get data
  const stone = getStoneById(config.stone);
  const stoneName = customStoneRequest || stone?.name || config.stone;
  const shapeName = SHAPES.find(s => s.id === config.shape)?.name[isNL ? 'nl' : 'en'] || config.shape;
  const finishName = FINISHES.find(f => f.id === config.finish)?.name[isNL ? 'nl' : 'en'] || config.finish;
  const edgeName = EDGE_PROFILES.find(e => e.id === config.edgeProfile)?.name[isNL ? 'nl' : 'en'] || config.edgeProfile;
  const leg = config.legStyle ? getLegById(config.legStyle) : null;
  const baseName = leg?.name || BASES.find(b => b.id === config.baseType)?.name[isNL ? 'nl' : 'en'] || '';
  
  const priceEstimate = calculateModularPrice(config);
  const leadTime = getModularLeadTime(config);

  const dimensionString = config.shape === 'round' && config.dimensions.radius
    ? `⌀${config.dimensions.radius * 2} × H${config.dimensions.height} cm`
    : `${config.dimensions.length} × ${config.dimensions.width} × H${config.dimensions.height} cm`;

  const thicknessString = `${config.dimensions.thickness * 10}mm`;

  let yPos = margin;

  // ============================================
  // HEADER
  // ============================================
  pdf.setFillColor(brandDark);
  pdf.rect(0, 0, pageWidth, 50, 'F');

  // Logo text
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SERA NORR', margin, 30);

  // Subtitle
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(isNL ? 'PROJECT DOSSIER' : 'PROJECT DOSSIER', margin, 40);

  // Build code
  pdf.setFontSize(10);
  pdf.text(`#${buildCode}`, pageWidth - margin, 40, { align: 'right' });

  yPos = 65;

  // ============================================
  // HERO IMAGE (3D Render)
  // ============================================
  if (viewerElement) {
    try {
      const canvas = await html2canvas(viewerElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#f5f5f5',
        scale: 2,
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height / canvas.width) * imgWidth;
      const maxImgHeight = 80;
      const finalImgHeight = Math.min(imgHeight, maxImgHeight);
      
      pdf.addImage(imgData, 'JPEG', margin, yPos, imgWidth, finalImgHeight);
      yPos += finalImgHeight + 10;
    } catch (error) {
      console.error('Failed to capture 3D viewer:', error);
      yPos += 10;
    }
  }

  // ============================================
  // TITLE
  // ============================================
  pdf.setTextColor(brandDark);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${shapeName} — ${stoneName}`, margin, yPos);
  yPos += 12;

  // ============================================
  // SPECIFICATIONS TABLE
  // ============================================
  pdf.setFontSize(8);
  pdf.setTextColor(brandMuted);
  pdf.text(isNL ? 'SPECIFICATIES' : 'SPECIFICATIONS', margin, yPos);
  yPos += 8;

  // Table rows
  const specs = [
    { label: isNL ? 'Vorm' : 'Shape', value: shapeName },
    { label: isNL ? 'Afmetingen' : 'Dimensions', value: dimensionString },
    { label: isNL ? 'Bladdikte' : 'Thickness', value: thicknessString },
    { label: isNL ? 'Steensoort' : 'Stone', value: stoneName },
    { label: isNL ? 'Afwerking' : 'Finish', value: finishName },
    { label: isNL ? 'Randprofiel' : 'Edge profile', value: edgeName },
    { label: isNL ? 'Onderstel' : 'Base', value: baseName },
  ];

  pdf.setFontSize(10);
  specs.forEach((spec, index) => {
    const rowY = yPos + (index * 8);
    const isEven = index % 2 === 0;
    
    // Row background
    if (isEven) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(margin, rowY - 4, contentWidth, 8, 'F');
    }
    
    // Label
    pdf.setTextColor(brandMuted);
    pdf.setFont('helvetica', 'normal');
    pdf.text(spec.label, margin + 2, rowY);
    
    // Value
    pdf.setTextColor(brandDark);
    pdf.setFont('helvetica', 'bold');
    pdf.text(spec.value, pageWidth - margin - 2, rowY, { align: 'right' });
  });

  yPos += specs.length * 8 + 15;

  // ============================================
  // PRICE & LEAD TIME
  // ============================================
  pdf.setFillColor(245, 245, 245);
  pdf.rect(margin, yPos - 5, contentWidth, 30, 'F');

  // Price
  pdf.setTextColor(brandMuted);
  pdf.setFontSize(8);
  pdf.text(isNL ? 'VANAF' : 'FROM', margin + 5, yPos + 3);
  
  pdf.setTextColor(brandDark);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text(formatVanafPrice(priceEstimate.vanafPrice), margin + 5, yPos + 14);

  // Lead time
  pdf.setFontSize(8);
  pdf.setTextColor(brandMuted);
  pdf.setFont('helvetica', 'normal');
  pdf.text(isNL ? 'LEVERTIJD' : 'LEAD TIME', margin + 80, yPos + 3);
  
  pdf.setTextColor(brandDark);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${leadTime.min}-${leadTime.max} ${isNL ? 'weken' : 'weeks'}`, margin + 80, yPos + 14);

  yPos += 40;

  // ============================================
  // SERVICE INCLUDED
  // ============================================
  pdf.setTextColor(brandMuted);
  pdf.setFontSize(8);
  pdf.text(isNL ? 'SERVICE & LEVERING (INBEGREPEN)' : 'SERVICE & DELIVERY (INCLUDED)', margin, yPos);
  yPos += 8;

  const services = [
    isNL ? '• White-glove levering tot in de ruimte' : '• White-glove delivery to your space',
    isNL ? '• Uitpakken, plaatsing en nivelleren' : '• Unpacking, placement and leveling',
    isNL ? '• Verpakkingsmateriaal retour' : '• Packaging material removal',
    isNL ? '• Onderhoudsadvies bij oplevering' : '• Care instructions upon delivery',
  ];

  pdf.setTextColor(brandDark);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  services.forEach((service, index) => {
    pdf.text(service, margin, yPos + (index * 6));
  });

  yPos += services.length * 6 + 15;

  // ============================================
  // TRUST ELEMENTS
  // ============================================
  const trustItems = [
    { label: isNL ? 'Handgemaakt op bestelling' : 'Handmade to order' },
    { label: isNL ? 'Ontworpen in NL' : 'Designed in NL' },
    { label: isNL ? '2 jaar garantie' : '2-year warranty' },
  ];

  pdf.setFillColor(brandDark);
  pdf.rect(margin, yPos - 2, contentWidth, 12, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  const trustWidth = contentWidth / trustItems.length;
  trustItems.forEach((item, index) => {
    const x = margin + (index * trustWidth) + (trustWidth / 2);
    pdf.text(item.label, x, yPos + 5, { align: 'center' });
  });

  yPos += 25;

  // ============================================
  // CTA
  // ============================================
  pdf.setTextColor(brandDark);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text(isNL ? 'Wij nemen binnen 24 uur contact met u op.' : 'We will contact you within 24 hours.', margin, yPos);
  yPos += 8;

  pdf.setTextColor(brandMuted);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('info@sera-norr.com', margin, yPos);
  pdf.text('sera-norr.com', margin + 50, yPos);

  // ============================================
  // FOOTER
  // ============================================
  pdf.setTextColor(brandMuted);
  pdf.setFontSize(7);
  const footerY = pageHeight - 15;
  pdf.text(`${isNL ? 'Dit document is gegenereerd op' : 'Generated on'} ${new Date().toLocaleDateString('nl-NL')}`, margin, footerY);
  pdf.text(priceEstimate.disclaimer, margin, footerY + 4);
  pdf.text(`#${buildCode}`, pageWidth - margin, footerY, { align: 'right' });

  // Return as blob
  return pdf.output('blob');
}

export async function downloadDossierPDF(options: PDFGeneratorOptions): Promise<void> {
  const blob = await generateDossierPDF(options);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `SERA-NORR-Dossier-${options.buildCode}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
