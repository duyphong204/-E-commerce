import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Order, OrderItem } from "../types";

export const exportOrderToPDF = (order: Order): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  const cleanText = (text?: string): string => {
    if (!text) return "";
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\x00-\x7F]/g, "")
      .replace(/[°]/g, "")
      .trim();
  };

  // HEADER
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, pageWidth, 50, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.text("HOA DON BAN HANG", pageWidth / 2, 22, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("DP ShopVN - E-commerce Platform", pageWidth / 2, 32, { align: "center" });
  doc.text("Phone: +84 935452263 | Email: support@dpshopvn.com", pageWidth / 2, 40, { align: "center" });

  // Line separator
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(15, 52, pageWidth - 15, 52);

  doc.setTextColor(0, 0, 0);

  // ORDER INFO
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`Order #${order._id.slice(-8)}`, 15, 62);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    `Ngay dat: ${new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(order.createdAt))}`,
    15,
    68
  );

  doc.setFont("helvetica", "bold");
  doc.text(`Trang thai: `, 15, 74);
  doc.setFont("helvetica", "normal");
  doc.text(order.status, 42, 74);

  // CUSTOMER INFO
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("THONG TIN KHACH HANG", pageWidth - 15, 62, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(cleanText(order.user?.name || "Khach"), pageWidth - 15, 68, { align: "right" });
  doc.text(`${order.user?.email || "N/A"}`, pageWidth - 15, 74, { align: "right" });

  // SHIPPING ADDRESS
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  doc.line(15, 80, pageWidth - 15, 80);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("DIA CHI GIAO HANG:", 15, 87);

  doc.setFont("helvetica", "normal");
  const addressParts = [
    cleanText(order.shippingAddress.address || ""),
    cleanText(order.shippingAddress.city || ""),
    cleanText(order.shippingAddress.country || ""),
  ].filter((part) => part.length > 0);

  const address = addressParts.join(", ");
  doc.text(address, 15, 93);

  const tableData = order.orderItems.map((item: OrderItem, index: number) => [
    index + 1,
    cleanText(item.name),
    item.size || "N/A",
    item.color || "N/A",
    item.quantity,
    `$${(item.price ?? 0).toFixed(2)}`,
    `$${((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: 102,
    head: [["#", "San pham", "Size", "Mau", "SL", "Don gia", "Thanh tien"]],
    body: tableData,
    theme: "plain",
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      halign: "center",
      cellPadding: 4,
      font: "helvetica",
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 3,
      font: "helvetica",
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 65 },
      2: { cellWidth: 15, halign: "center" },
      3: { cellWidth: 15, halign: "center" },
      4: { cellWidth: 10, halign: "center" },
      5: { cellWidth: 25, halign: "right" },
      6: { cellWidth: 30, halign: "right", fontStyle: "bold" },
    },
    styles: {
      lineColor: [220, 220, 220],
      lineWidth: 0.2,
      font: "helvetica",
    },
  });

  // SUMMARY
  const docWithTable = doc as unknown as { lastAutoTable?: { finalY?: number } };
  const finalY = docWithTable.lastAutoTable?.finalY ? docWithTable.lastAutoTable.finalY + 15 : 200;
  const discount = order.discountAmount ?? 0;
  const subtotal = order.subtotal ?? 0;
  const total = order.totalPrice ?? 0;

  const summaryX = pageWidth - 80;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text("Tam tinh:", summaryX, finalY);
  doc.text(`$${subtotal.toFixed(2)}`, pageWidth - 15, finalY, { align: "right" });

  if (discount > 0) {
    doc.text("Giam gia:", summaryX, finalY + 6);
    doc.text(`-$${discount.toFixed(2)}`, pageWidth - 15, finalY + 6, { align: "right" });
  }

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  const lineY = finalY + (discount > 0 ? 10 : 4);
  doc.line(summaryX, lineY, pageWidth - 15, lineY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  const totalY = lineY + 7;
  doc.text("TONG CONG:", summaryX, totalY);
  doc.text(`$${total.toFixed(2)}`, pageWidth - 15, totalY, { align: "right" });

  // FOOTER
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  const footerLineY = doc.internal.pageSize.height - 30;
  doc.line(15, footerLineY, pageWidth - 15, footerLineY);

  doc.setTextColor(80, 80, 80);
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text("Cam on quy khach da mua hang tai DP ShopVN!", pageWidth / 2, footerLineY + 7, { align: "center" });
  doc.setFontSize(8);
  doc.text("Moi thac mac vui long lien he: support@dpshopvn.com | +84 935452263", pageWidth / 2, footerLineY + 12, { align: "center" });

  doc.save(`Invoice_${order._id.slice(-8)}.pdf`);
};
