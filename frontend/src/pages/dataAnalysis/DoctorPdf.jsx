import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";

export default function DoctorPdf() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5556/doctors/getalldoctors");
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchDoctors();
  }, []);

  function generatePDF() {
    const doc = new jsPDF();
    const tableColumn = [
      "No",
      "Name",
      "Specialization",
      "Contact Number",
      "Email",
      "Experience (Years)",
      "Clinic Address",
      "City",
    ];
    const tableRows = [];

    doctors
      .slice(0) // Optional: reverse order if needed
      .reverse()
      .map((doctor, index) => {
        const data = [
          index + 1,
          doctor.name,
          doctor.specialization,
          doctor.contactNumber,
          doctor.email,
          doctor.experience,
          doctor.clinicAddress,
          doctor.city,
        ];
        tableRows.push(data);
      });

    const date = new Date();
    const dateStr = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;

    // Add title, date, and header
    doc.setFontSize(28).setFont("helvetica", "bold").setTextColor("green");
    doc.text("Doctor List Report", 60, 15);

    doc.setFont("helvetica", "normal").setFontSize(20).setTextColor(0, 0, 0);
    doc.text("Doctor Details", 65, 25);

    doc.setFont("times", "normal").setFontSize(15).setTextColor(100, 100, 100);
    doc.text(`Report Generated Date: ${dateStr}`, 65, 35);

    doc.setFont("courier", "normal").setFontSize(12).setTextColor(150, 150, 150);
    doc.text("Healthcare System, AgriHub, Sri Lanka", 30, 45);

    doc.text(
      "--------------------------------------------------------------------------------------------------",
      0,
      49
    );

    // Generate table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      styles: { fontSize: 9 },
      headStyles: {
        fillColor: [31, 41, 55],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    });

    // Save the generated PDF
    doc.save(`Doctor-List-Report_${dateStr}.pdf`);
  }

  return (
    <div>
      <button
        onClick={generatePDF}
        className="btn2 px-4 py-2 bg-green-500 text-white rounded-lg"
      >
        Generate Doctor Report
      </button>
    </div>
  );
}
