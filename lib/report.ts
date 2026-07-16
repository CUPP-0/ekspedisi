import db from "@/lib/db";

interface Filter {
  start?: string | null;
  end?: string | null;
  branch?: string | null;
  status?: string | null;
}

export async function getShipmentReport(filter: Filter) {

  const {
    start,
    end,
    branch,
    status,
  } = filter;

  let sql = `

    SELECT

      s.id,
      s.tracking_number,

      sender.name sender_name,
      sender.phone sender_phone,

      receiver.name receiver_name,
      receiver.phone receiver_phone,

      ob.name origin_branch,
      dbs.name destination_branch,

      s.status,
      s.total_weight,
      s.total_price,
      s.created_at

    FROM shipments s

    JOIN customers sender
      ON sender.id = s.sender_id

    JOIN customers receiver
      ON receiver.id = s.receiver_id

    JOIN branches ob
      ON ob.id = s.origin_branch_id

    JOIN branches dbs
      ON dbs.id = s.destination_branch_id

    WHERE 1=1

  `;

  const params: any[] = [];

  if (start) {

    sql += ` AND DATE(s.created_at)>=?`;

    params.push(start);

  }

  if (end) {

    sql += ` AND DATE(s.created_at)<=?`;

    params.push(end);

  }

  if (branch) {

    sql += ` AND s.origin_branch_id=?`;

    params.push(branch);

  }

  if (status) {

    sql += ` AND s.status=?`;

    params.push(status);

  }

  sql += ` ORDER BY s.created_at DESC`;

  const [rows]: any = await db.query(sql, params);

  return rows;

}

export function getSummary(rows: any[]) {

  const totalShipment = rows.length;

  const totalRevenue = rows.reduce(

    (total, row) => total + Number(row.total_price),

    0

  );

  const delivered = rows.filter(

    (row) => row.status === "delivered"

  ).length;

  const pending = rows.filter(

    (row) => row.status === "pending"

  ).length;

  const picked_up = rows.filter(

    (row) => row.status === "picked_up"

  ).length;

  const assigned = rows.filter(

    (row) => row.status === "assigned"

  ).length;

  const transit = rows.filter(

    (row) => row.status === "in_transit"

  ).length;

  return {

    totalShipment,

    totalRevenue,

    delivered,

    pending,

    picked_up,

    assigned,

    transit,

  };

}