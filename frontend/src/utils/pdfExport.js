import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const exportOrderToPDF = (order) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("HÓA ĐƠN BÁN HÀNG", 105, 20, { align: "center" });

    // Company info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("DP ShopVN - E-commerce Platform", 105, 28, { align: "center" });
    doc.text("Phone: +84 935452263", 105, 33, { align: "center" });

    // Line separator
    doc.setLineWidth(0.5);
    doc.line(20, 38, 190, 38);

    // Order info
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Order ID: #${order._id.slice(-8)}`, 20, 48);
    doc.setFont("helvetica", "normal");
    doc.text(
        `Ngay dat: ${new Intl.DateTimeFormat("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(new Date(order.createdAt))}`,
        20,
        54
    );
    doc.text(`Trang thai: ${order.status}`, 20, 60);

    // Customer info
    doc.setFont("helvetica", "bold");
    doc.text("Thong tin khach hang:", 20, 70);
    doc.setFont("helvetica", "normal");
    doc.text(`Ten: ${order.user?.name || "Khach"}`, 20, 76);
    doc.text(`Email: ${order.user?.email || "N/A"}`, 20, 82);
    doc.text(
        `Dia chi: ${order.shippingAddress.address}, ${order.shippingAddress.city}`,
        20,
        88
    );
    doc.text(
        `Ma buu dien: ${order.shippingAddress.postalCode}`,
        20,
        94
    );

    // Products table
    const tableData = order.orderItems.map((item, index) => [
        index + 1,
        item.name,
        item.size || "N/A",
        item.color || "N/A",
        item.quantity,
        `$${(item.price ?? 0).toFixed(2)}`,
        `$${((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}`,
    ]);

    doc.autoTable({
        startY: 105,
        head: [["STT", "San pham", "Size", "Mau", "SL", "Don gia", "Thanh tien"]],
        body: tableData,
        theme: "grid",
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: "bold",
        },
        styles: {
            fontSize: 9,
            cellPadding: 3,
        },
        columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 50 },
            2: { cellWidth: 20 },
            3: { cellWidth: 20 },
            4: { cellWidth: 15 },
            5: { cellWidth: 25 },
            6: { cellWidth: 30 },
        },
    });

    // Summary
    const finalY = doc.lastAutoTable.finalY + 10;
    const discount = order.discountAmount ?? 0;
    const total = order.totalPrice ?? 0;

    if (discount > 0) {
        doc.setFont("helvetica", "normal");
        doc.text(`Giam gia:`, 120, finalY);
        doc.text(`-$${discount.toFixed(2)}`, 170, finalY, { align: "right" });
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Tong cong:`, 120, finalY + (discount > 0 ? 6 : 0));
    doc.text(`$${total.toFixed(2)}`, 170, finalY + (discount > 0 ? 6 : 0), { align: "right" });

    // Footer
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text(
        "Cam on quy khach da mua hang!",
        105,
        doc.internal.pageSize.height - 20,
        { align: "center" }
    );

    doc.save(`Order_${order._id.slice(-8)}.pdf`);
};
