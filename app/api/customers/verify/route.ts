import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {

    try{

        const {
            email,
            otp
        } = await req.json();

        const [rows]:any = await db.query(
`
SELECT *
FROM customer_verifications
WHERE email=?
AND otp=?
AND expired_at > NOW()
LIMIT 1
`,
[email,otp]
        );

        if(!rows.length){

            return NextResponse.json({
                message:"OTP salah atau sudah expired."
            },{status:400});

        }

        const user = rows[0];

        await db.query(
`
INSERT INTO customers
(
name,
email,
password,
city,
phone,
address,
created_at,
updated_at
)
VALUES
(
?,?,?,?,?,?,NOW(),NOW()
)
`,
[
user.name,
user.email,
user.password,
user.city,
user.phone,
user.address
]
        );

        await db.query(
            "DELETE FROM customer_verifications WHERE id=?",
            [user.id]
        );

        return NextResponse.json({
            success:true,
            message:"Registrasi berhasil."
        });

    }catch(err){

        console.log(err);

        return NextResponse.json({
            message:"Server Error"
        },{status:500});

    }

}