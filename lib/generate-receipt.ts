import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generateReceiptPDF(shipment: any, items: any[]) {
  // 1. Buat temporary element untuk render resi
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '0';
  tempDiv.style.width = '800px';
  tempDiv.style.padding = '40px';
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.fontFamily = 'Arial, sans-serif';
  tempDiv.style.color = '#000';

  // 2. Isi content resi
  tempDiv.innerHTML = `
    <div style="border: 2px solid #dc2626; padding: 30px; border-radius: 8px;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 3px solid #dc2626; padding-bottom: 20px; margin-bottom: 20px;">
        <h1 style="margin: 0; color: #dc2626; font-size: 32px;">BAZMA Express</h1>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Solusi Pengiriman Terpercaya</p>
      </div>

      <!-- Title -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="margin: 0; color: #1f2937; font-size: 24px;">RESI PENGIRIMAN</h2>
        <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: bold; color: #dc2626;">
          No. Resi: ${shipment.tracking_number}
        </p>
      </div>

      <!-- Info Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
        <!-- Pengirim -->
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
          <h3 style="margin: 0 0 15px 0; color: #dc2626; font-size: 16px; border-bottom: 2px solid #dc2626; padding-bottom: 8px;">
            📦 PENGIRIM
          </h3>
          <p style="margin: 5px 0;"><strong>Nama:</strong> ${shipment.sender_name}</p>
          <p style="margin: 5px 0;"><strong>Telepon:</strong> ${shipment.sender_phone}</p>
          <p style="margin: 5px 0;"><strong>Alamat:</strong> ${shipment.sender_address}</p>
        </div>

        <!-- Penerima -->
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
          <h3 style="margin: 0 0 15px 0; color: #dc2626; font-size: 16px; border-bottom: 2px solid #dc2626; padding-bottom: 8px;">
            🏠 PENERIMA
          </h3>
          <p style="margin: 5px 0;"><strong>Nama:</strong> ${shipment.receiver_name}</p>
          <p style="margin: 5px 0;"><strong>Telepon:</strong> ${shipment.receiver_phone}</p>
          <p style="margin: 5px 0;"><strong>Alamat:</strong> ${shipment.receiver_address}</p>
        </div>
      </div>

      <!-- Rute -->
      <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
        <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 16px;">🚚 RUTE PENGIRIMAN</h3>
        <div style="display: flex; justify-content: space-around; align-items: center;">
          <div>
            <p style="margin: 0; font-size: 12px; color: #666;">DARI</p>
            <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #dc2626;">${shipment.origin_branch}</p>
          </div>
          <div style="font-size: 30px; color: #dc2626;">→</div>
          <div>
            <p style="margin: 0; font-size: 12px; color: #666;">KE</p>
            <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #dc2626;">${shipment.destination_branch}</p>
          </div>
        </div>
      </div>

      <!-- Tabel Barang -->
      <div style="margin-bottom: 30px;">
        <h3 style="margin: 0 0 15px 0; color: #dc2626; font-size: 16px; border-bottom: 2px solid #dc2626; padding-bottom: 8px;">
          📋 DAFTAR BARANG
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead>
            <tr style="background: #dc2626; color: white;">
              <th style="padding: 10px; text-align: left; border: 1px solid #dc2626;">No</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #dc2626;">Nama Barang</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #dc2626;">Qty</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #dc2626;">Berat (Kg)</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #dc2626;">Total (Kg)</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, index) => `
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${index + 1}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${item.item_name}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.weight}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${(item.quantity * item.weight).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr style="background: #f3f4f6; font-weight: bold;">
              <td colspan="4" style="padding: 10px; border: 1px solid #ddd; text-align: right;">TOTAL BERAT:</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #dc2626;">${shipment.total_weight} Kg</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Summary -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 30px;">
        <div style="background: #dbeafe; padding: 20px; border-radius: 8px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #1e40af;">TANGGAL KIRIM</p>
          <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: bold; color: #1e40af;">
            ${new Date(shipment.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #92400e;">STATUS</p>
          <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: bold; color: #92400e; text-transform: uppercase;">
            ${shipment.status.replaceAll('_', ' ')}
          </p>
        </div>
        <div style="background: #dcfce7; padding: 20px; border-radius: 8px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #166534;">TOTAL ONGKIR</p>
          <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: bold; color: #166534;">
            Rp ${Number(shipment.total_price).toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 2px solid #dc2626; padding-top: 20px; text-align: center;">
        <p style="margin: 0; color: #666; font-size: 12px;">
          Terima kasih telah menggunakan layanan BAZMA Express
        </p>
        <p style="margin: 5px 0 0 0; color: #999; font-size: 11px;">
          Resi ini dicetak pada: ${new Date().toLocaleString('id-ID')}
        </p>
        <p style="margin: 10px 0 0 0; color: #dc2626; font-size: 12px; font-weight: bold;">
          www.bazmaexpress.com | CS: 0812-3456-7890
        </p>
      </div>
    </div>
  `;

  // 3. Tambahkan ke DOM
  document.body.appendChild(tempDiv);

  try {
    // 4. Convert HTML ke canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2, // High quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // 5. Convert canvas ke PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // 6. Download PDF
    pdf.save(`Resi-${shipment.tracking_number}.pdf`);
  } finally {
    // 7. Cleanup
    document.body.removeChild(tempDiv);
  }
}