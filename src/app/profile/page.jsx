import ChartClient from "@/components/ChartClient"
import { db } from "@/utils/dbconnection"
import Link from "next/link"
import { currentUser } from '@clerk/nextjs/server';

export default async function Profile(){

    const user = await currentUser();
    // console.log(user?.username);
    const email = user?.emailAddresses[0].emailAddress
    // console.log(email);
    let { rows: userRows } = await db.query(`SELECT * FROM youco2 WHERE email = $1 ORDER BY id LIMIT 20`,[
        email
    ]);
    // console.log(userRows);
    let uservalues = [];
    let usernames = [];
    for (let i = 0; i < userRows.length; i++) {
        uservalues.push(userRows[i].co2);
        usernames.push(userRows[i].name);
    }
    // console.log(uservalues);
    // console.log(usernames);

   let { rows: allRows } = await db.query(`SELECT * FROM youco2 ORDER BY id LIMIT 20`);
    // console.log(userRows);
    let allvalues = [];
    let allnames = [];
    for (let i = 0; i < allRows.length; i++) {
        allvalues.push(allRows[i].co2);
        allnames.push(allRows[i].name);
    }
    // console.log(allvalues);
    // console.log(allnames);
 

    return(
        <>
            <ChartClient
                allvalues={allvalues}
                allnames={allnames}
                uservalues={uservalues}
                usernames={usernames}
            />
            <Link href={`/quiz`}>New Entry</Link>
        </>
    )
}