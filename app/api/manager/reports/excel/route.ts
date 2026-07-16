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

    const branch = searchParams.get('branch');

    const status = searchParams.get('status');
    let sql = `

      SELECT

      s.id,
      s.tracking_number,

      sender.name sender_name,
      receiver.name receiver_name,

      ob.name origin_branch,
      dbs.name destination_branch,

      s.status,
      s.total_weight,
      s.total_price,
      s.created_at

      FROM shipments s

      JOIN customers sender
      ON sender.id=s.sender_id

      JOIN customers receiver
      ON receiver.id=s.receiver_id

      JOIN branches ob
      ON ob.id=s.origin_branch_id

      JOIN branches dbs
      ON dbs.id=s.destination_branch_id

      WHERE 1=1

    `;

    const params: any[] = [];

    if (start) {
      sql += ' AND DATE(s.created_at)>=?';

      params.push(start);
    }

    if (end) {
      sql += ' AND DATE(s.created_at)<=?';

      params.push(end);
    }

    if (branch) {
      sql += ' AND s.origin_branch_id=?';

      params.push(branch);
    }

    if (status) {
      sql += ' AND s.status=?';

      params.push(status);
    }

    sql += ' ORDER BY s.created_at DESC';

    const [rows]: any = await db.query(sql, params);
    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'Ekspedisi';

    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Shipment Report');
    sheet.mergeCells('A1:I1');

    sheet.getCell('A1').value = 'SHIPMENT REPORT';

    sheet.getCell('A1').font = {
      bold: true,

      size: 20,

      color: { argb: 'FFFFFF' },
    };

    sheet.getCell('A1').alignment = {
      horizontal: 'center',
    };

    sheet.getCell('A1').fill = {
      type: 'pattern',

      pattern: 'solid',

      fgColor: { argb: '1E40AF' },
    };

    sheet.mergeCells('A2:I2');

    sheet.getCell('A2').value = `Periode : ${start || '-'} s/d ${end || '-'}`;

    sheet.getCell('A2').alignment = {
      horizontal: 'center',
    };
    const totalShipment = rows.length;

    const totalRevenue = rows.reduce(
      (a: any, b: any) => a + Number(b.total_price),

      0,
    );

    const delivered = rows.filter((x: any) => x.status == 'delivered').length;

    const pending = rows.filter((x: any) => x.status == 'pending').length;
    sheet.addRow([]);

    sheet.addRow(['SUMMARY']);

    sheet.addRow(['Total Shipment', totalShipment]);

    sheet.addRow(['Revenue', totalRevenue]);

    sheet.addRow(['Delivered', delivered]);

    sheet.addRow(['Pending', pending]);

    sheet.addRow([]);
    const header = sheet.addRow(['No', 'Tracking', 'Pengirim', 'Penerima', 'Cabang Asal', 'Cabang Tujuan', 'Status', 'Berat', 'Ongkir']);

    header.font = {
      bold: true,

      color: { argb: 'FFFFFF' },
    };

    header.fill = {
      type: 'pattern',

      pattern: 'solid',

      fgColor: { argb: '2563EB' },
    };

    header.alignment = {
      horizontal: 'center',
    };
    let no = 1;

    rows.forEach((row: any) => {
      sheet.addRow([no++, row.tracking_number, row.sender_name, row.receiver_name, row.origin_branch, row.destination_branch, row.status, Number(row.total_weight), Number(row.total_price)]);
    });
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber >= 10) {
        row.getCell(9).numFmt = '"Rp"#,##0';
      }
    });
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: {
            style: 'thin',
          },

          left: {
            style: 'thin',
          },

          bottom: {
            style: 'thin',
          },

          right: {
            style: 'thin',
          },
        };
      });
    });
    sheet.columns = [{ width: 8 }, { width: 22 }, { width: 28 }, { width: 28 }, { width: 22 }, { width: 22 }, { width: 18 }, { width: 12 }, { width: 18 }];
    sheet.addRow([]);

    const totalRow = sheet.addRow(['', '', '', '', '', '', '', 'TOTAL', totalRevenue]);

    totalRow.font = {
      bold: true,
    };

    totalRow.getCell(9).numFmt = '"Rp"#,##0';
    sheet.addRow([]);

    sheet.addRow([`Printed at : ${new Date().toLocaleString('id-ID')}`]);
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer as any, {
      status: 200,

      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

        'Content-Disposition': `attachment; filename=Shipment_Report_${Date.now()}.xlsx`,
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
