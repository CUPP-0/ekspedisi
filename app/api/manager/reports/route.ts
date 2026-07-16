import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import db from "@/lib/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(req: NextRequest) {

    try{

        const token=req.cookies.get("token")?.value;

        if(!token){

            return NextResponse.json(
                {message:"Unauthorized"},
                {status:401}
            );

        }

        const {payload}:any=await jwtVerify(token,secret);

        if(payload.role!="manager"){

            return NextResponse.json(
                {message:"Forbidden"},
                {status:403}
            );

        }

        const searchParams=req.nextUrl.searchParams;

        const start=searchParams.get("start");

        const end=searchParams.get("end");

        const branch=searchParams.get("branch");

        const status=searchParams.get("status");

        let sql=`

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

        const params:any[]=[];

        if(start){

            sql+=" AND DATE(s.created_at)>=?";

            params.push(start);

        }

        if(end){

            sql+=" AND DATE(s.created_at)<=?";

            params.push(end);

        }

        if(branch){

            sql+=" AND s.origin_branch_id=?";

            params.push(branch);

        }

        if(status){

            sql+=" AND s.status=?";

            params.push(status);

        }

        sql+=" ORDER BY s.created_at DESC";

        const [rows]:any=await db.query(sql,params);

        const totalShipment=rows.length;

        const totalRevenue=rows.reduce(
            (a:any,b:any)=>a+Number(b.total_price),
            0
        );

        const delivered=rows.filter(
            (x:any)=>x.status=="delivered"
        ).length;

        const pending=rows.filter(
            (x:any)=>x.status=="pending"
        ).length;

        return NextResponse.json({

            summary:{
                totalShipment,
                totalRevenue,
                delivered,
                pending,
            },

            data:rows

        });

    }

    catch(err){

        console.log(err);

        return NextResponse.json(
            {
                message:"Server Error"
            },
            {
                status:500
            }
        );

    }

}