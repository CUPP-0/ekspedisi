import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import db from '@/lib/db';
import ExcelJS from 'exceljs';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { payload }: any = await jwtVerify(token, secret);

    if (payload.role !== 'manager') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const searchParams = req.nextUrl.searchParams;

    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const status = searchParams.get('status');
    const method = searchParams.get('method');

    let sql = `

      SELECT

      p.id,
      p.order_id,
      p.transaction_id,
      p.amount,
      p.payment_method,
      p.payment_status,
      p.payment_date,
      p.created_at,

      s.tracking_number,

      c.name customer_name

      FROM payments p

      JOIN shipments s
      ON s.id = p.shipment_id

      JOIN customers c
      ON c.id = s.sender_id

      WHERE 1=1

    `;

    const params: any[] = [];

    if (start) {
      sql += ' AND DATE(p.payment_date) >= ?';

      params.push(start);
    }

    if (end) {
      sql += ' AND DATE(p.payment_date) <= ?';

      params.push(end);
    }

    if (status) {
      sql += ' AND p.payment_status = ?';

      params.push(status);
    }

    if (method) {
      sql += ' AND p.payment_method = ?';

      params.push(method);
    }

    sql += ' ORDER BY p.created_at DESC';

    const [rows]: any = await db.query(sql, params);

    const totalPayment = rows.length;

    const totalRevenue = rows.filter((x: any) => x.payment_status === 'paid').reduce((a: number, b: any) => a + Number(b.amount), 0);

    const paid = rows.filter((x: any) => x.payment_status === 'paid').length;

    const pending = rows.filter((x: any) => x.payment_status === 'pending').length;

    const failed = rows.filter((x: any) => x.payment_status === 'failed').length;

    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'Ekspedisi';

    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Payment Report');

    sheet.mergeCells('A1:G1');

    sheet.getCell('A1').value = 'PAYMENT REPORT';

    sheet.getCell('A1').font = {
      size: 20,
      bold: true,
      color: { argb: 'FFFFFF' },
    };

    sheet.getCell('A1').alignment = {
      horizontal: 'center',
    };

    sheet.getCell('A1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: '2563EB',
      },
    };

    sheet.mergeCells('A2:G2');

    sheet.getCell('A2').value = `Periode : ${start || '-'} s/d ${end || '-'}`;

    sheet.getCell('A2').alignment = {
      horizontal: 'center',
    };

    sheet.addRow([]);

    sheet.addRow(['SUMMARY']);

    sheet.addRow(['Total Payment', totalPayment]);

    sheet.addRow(['Paid', paid]);

    sheet.addRow(['Pending', pending]);

    sheet.addRow(['Failed', failed]);

    sheet.addRow(['Revenue', totalRevenue]);

    sheet.addRow([]);

    const header = sheet.addRow(['No', 'Tracking', 'Customer', 'Method', 'Status', 'Amount', 'Payment Date']);

    header.font = {
      bold: true,

      color: {
        argb: 'FFFFFF',
      },
    };

    header.fill = {
      type: 'pattern',

      pattern: 'solid',

      fgColor: {
        argb: '2563EB',
      },
    };

    header.alignment = {
      horizontal: 'center',
    };
    let no = 1;

    rows.forEach((item: any) => {
      sheet.addRow([no++, item.tracking_number, item.customer_name, item.payment_method || '-', item.payment_status, Number(item.amount), item.payment_date ? new Date(item.payment_date) : '-']);
    });

    // ==========================
    // Format Rupiah
    // ==========================

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber >= 11) {
        row.getCell(6).numFmt = '"Rp"#,##0';
      }
    });

    // ==========================
    // Format Tanggal
    // ==========================

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber >= 11) {
        row.getCell(7).numFmt = 'dd/mm/yyyy';
      }
    });

    // ==========================
    // Border
    // ==========================

    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },

          left: { style: 'thin' },

          right: { style: 'thin' },

          bottom: { style: 'thin' },
        };
      });
    });

    // ==========================
    // Auto Width
    // ==========================

    sheet.columns = [{ width: 8 }, { width: 22 }, { width: 30 }, { width: 20 }, { width: 18 }, { width: 18 }, { width: 18 }];

    // ==========================
    // Footer
    // ==========================

    sheet.addRow([]);

    sheet.addRow([`Printed : ${new Date().toLocaleString('id-ID')}`]);

    // ==========================
    // Download
    // ==========================

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer as any, {
      status: 200,

      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

        'Content-Disposition': `attachment; filename=Payment_Report_${Date.now()}.xlsx`,
      },
    });
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      {
        message: 'Server Error',
      },

      {
        status: 500,
      },
    );
  }
}
