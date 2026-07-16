import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import db from '@/lib/db';
import PDFDocument from 'pdfkit';

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

    const totalShipment = rows.length;

    const totalRevenue = rows.reduce(
      (a: any, b: any) => a + Number(b.total_price),

      0,
    );

    const delivered = rows.filter((x: any) => x.status == 'delivered').length;

    const pending = rows.filter((x: any) => x.status == 'pending').length;
    const doc = new PDFDocument({
      size: 'A4',

      margin: 40,
    });

    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));

    const endPromise = new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
    });
    doc

      .fontSize(22)

      .fillColor('#1E3A8A')

      .text('SHIPMENT REPORT', {
        align: 'center',
      });

    doc.moveDown(0.5);

    doc

      .fontSize(11)

      .fillColor('black')

      .text(
        `Periode : ${start || '-'} s/d ${end || '-'}`,

        {
          align: 'center',
        },
      );

    doc.moveDown();
    doc

      .fontSize(14)

      .text('Summary');

    doc.moveDown(0.5);

    doc

      .fontSize(11)

      .text(`Total Shipment : ${totalShipment}`);

    doc.text(`Delivered : ${delivered}`);

    doc.text(`Pending : ${pending}`);

    doc.text(`Revenue : Rp ${totalRevenue.toLocaleString('id-ID')}`);

    doc.moveDown();
    let y = doc.y;

    doc

      .fontSize(10)

      .font('Helvetica-Bold');

    doc.text('No', 40, y);

    doc.text('Tracking', 70, y);

    doc.text('Sender', 160, y);

    doc.text('Receiver', 250, y);

    doc.text('Status', 350, y);

    doc.text('Price', 440, y);

    y += 18;

    doc
      .moveTo(40, y)

      .lineTo(560, y)

      .stroke();

    y += 8;
    doc.font('Helvetica');

    let no = 1;

    rows.forEach((row: any) => {
      // kalau sudah bawah halaman
      if (y > 760) {
        doc.addPage();

        y = 50;

        doc.font('Helvetica-Bold').fontSize(10);

        doc.text('No', 40, y);

        doc.text('Tracking', 70, y);

        doc.text('Sender', 160, y);

        doc.text('Receiver', 250, y);

        doc.text('Status', 350, y);

        doc.text('Price', 440, y);

        y += 18;

        doc.moveTo(40, y).lineTo(560, y).stroke();

        y += 8;

        doc.font('Helvetica');
      }

      doc.text(String(no++), 40, y);

      doc.text(
        row.tracking_number,

        70,

        y,

        {
          width: 80,
        },
      );

      doc.text(
        row.sender_name,

        160,

        y,

        {
          width: 80,
        },
      );

      doc.text(
        row.receiver_name,

        250,

        y,

        {
          width: 80,
        },
      );

      doc.text(
        row.status,

        350,

        y,

        {
          width: 70,
        },
      );

      doc.text(
        `Rp ${Number(row.total_price).toLocaleString('id-ID')}`,

        440,

        y,

        {
          width: 90,

          align: 'right',
        },
      );

      y += 22;
    });
    doc.moveTo(40, y).lineTo(560, y).stroke();

    y += 20;
    doc

      .font('Helvetica-Bold')

      .fontSize(12);

    doc.text(
      `TOTAL REVENUE : Rp ${totalRevenue.toLocaleString('id-ID')}`,

      300,

      y,

      {
        width: 250,

        align: 'right',
      },
    );

    y += 40;
    doc

      .font('Helvetica')

      .fontSize(10)

      .fillColor('gray');

    doc.text(
      `Printed at : ${new Date().toLocaleString('id-ID')}`,

      40,

      y,
    );

    doc.text(
      'Generated by Ekspedisi System',

      40,

      y + 18,
    );
    doc.end();

    const pdf = await endPromise;

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',

        'Content-Disposition': `attachment; filename=Shipment_Report_${Date.now()}.pdf`,
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
