"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CertificateProps {
  studentName: string;
  matricNumber: string;
  skillTrack: string;
  classification: string;
  date: string;
}

export default function CertificateDownloader({
  studentName,
  matricNumber,
  skillTrack,
  classification,
  date,
}: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadCertificate = async () => {
    const element = certificateRef.current;
    if (!element) return;

    setIsGenerating(true);
    try {
      // Temporarily reveal the element off-screen for the canvas to capture it
      element.style.display = "block";
      element.style.position = "absolute";
      element.style.left = "-9999px";
      
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      
      // Create A4 Landscape PDF (297mm x 210mm)
      const pdf = new jsPDF("landscape", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
      pdf.save(`${studentName.replace(/\s+/g, "_")}_OUI_Certificate.pdf`);
      
    } catch (error) {
      console.error("Failed to generate certificate", error);
    } finally {
      // Hide it again
      element.style.display = "none";
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        onClick={downloadCertificate}
        disabled={isGenerating}
        className="mt-6 inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-[#1D5FA7] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#15467e] disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {isGenerating ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="31.4 31.4" opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>
            Generating PDF...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" /></svg>
            Download Official Certificate
          </span>
        )}
      </button>

      {/* The Hidden Certificate Template */}
      <div 
        ref={certificateRef}
        style={{
          display: "none",
          width: "1123px", 
          height: "794px", 
          padding: "40px",
          backgroundColor: "#ffffff",
          color: "#0F2747",
          fontFamily: "Arial, sans-serif",
          boxSizing: "border-box",
        }}
      >
        <div style={{ border: "4px solid #1D5FA7", height: "100%", padding: "10px", boxSizing: "border-box" }}>
          <div style={{ border: "1px solid #1D5FA7", height: "100%", padding: "40px 50px", textAlign: "center", position: "relative", backgroundColor: "#FAFCFF", boxSizing: "border-box" }}>
            <h1 style={{ fontSize: "48px", fontWeight: "900", margin: "0.2rem 0 10px 0", color: "#1D5FA7", textTransform: "uppercase", letterSpacing: "3px" }}>
              Certificate of Excellence
            </h1>
            <p style={{ fontSize: "20px", fontWeight: "bold", color: "#5B6474", marginBottom: "35px", letterSpacing: "1px" }}>
              ODUDUWA UNIVERSITY, IPETUMODU — SIWES ENTREPRENEURSHIP PROGRAM
            </p>
            
            <p style={{ fontSize: "20px", marginBottom: "10px", color: "#7A8494", fontStyle: "italic" }}>This is to certify that</p>
            <h2 style={{ fontSize: "42px", fontWeight: "bold", textDecoration: "underline", margin: "0 0 10px 0", color: "#0F2747" }}>
              {studentName}
            </h2>
            <p style={{ fontSize: "18px", color: "#7A8494", marginBottom: "30px" }}>
              Matriculation Number: <strong style={{color: "#0F2747"}}>{matricNumber}</strong>
            </p>

            <p style={{ fontSize: "20px", marginBottom: "15px", lineHeight: "1.5", maxWidth: "800px", margin: "0 auto 30px", color: "#5B6474" }}>
              Has successfully completed the intensive practical training and examination in
              <br/>
              <strong style={{ fontSize: "28px", display: "block", marginTop: "10px", color: "#1D5FA7" }}>{skillTrack}</strong>
            </p>

            <div style={{ display: "inline-block", padding: "12px 25px", border: "2px dashed #1D5FA7", backgroundColor: "#F0F5FA" }}>
              <p style={{ fontSize: "14px", textTransform: "uppercase", fontWeight: "bold", color: "#7A8494", marginBottom: "3px" }}>Awarded Classification</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "#1D5FA7", margin: "0" }}>{classification}</p>
            </div>

            <div style={{ position: "absolute", bottom: "45px", left: "60px", textAlign: "center" }}>
              <div style={{ borderBottom: "2px solid #0F2747", width: "220px", marginBottom: "10px" }}></div>
              <p style={{ fontSize: "16px", fontWeight: "bold", color: "#0F2747", margin: 0 }}>Program Director</p>
            </div>
            
            <div style={{ position: "absolute", bottom: "45px", right: "60px", textAlign: "center" }}>
              <div style={{ borderBottom: "2px solid #0F2747", width: "220px", marginBottom: "10px", paddingBottom: "2px", fontSize: "18px", fontWeight: "bold", color: "#0F2747" }}>
                {date}
              </div>
              <p style={{ fontSize: "16px", fontWeight: "bold", color: "#0F2747", margin: 0 }}>Date of Issue</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}