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

        const search=searchParams.get("search") || "";

        const status=searchParams.get("status") || "";

        let sql=`

        SELECT

        s.id,
        s.tracking_number,
        s.status,
        s.total_weight,
        s.total_price,
        s.created_at,

        sender.name sender_name,
        receiver.name receiver_name,

        ob.name origin_branch,
        dbs.name destination_branch

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

        if(search){

            sql+=`
            AND(

            s.tracking_number LIKE ?

            OR sender.name LIKE ?

            OR receiver.name LIKE ?

            )
            `;

            params.push(
                `%${search}%`,
                `%${search}%`,
                `%${search}%`
            );

        }

        if(status){

            sql+=`
            AND s.status=?
            `;

            params.push(status);

        }

        sql+=`
        ORDER BY s.created_at DESC
        `;

        const [rows]:any=await db.query(sql,params);

        return NextResponse.json(rows);

    }

    catch(err){

        console.log(err);

        return NextResponse.json(
            {message:"Server Error"},
            {status:500}
        );

    }

}