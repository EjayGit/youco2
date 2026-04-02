import MyChart from "@/components/MyChart"
import { db } from "@/utils/dbconnection"
import Link from "next/link"
import { currentUser } from '@clerk/nextjs/server';

export default async function Profile(){

    const user = await currentUser();
    // console.log(user);
    const email = user?.emailAddresses[0].emailAddress
    // console.log(email);
    let { rows: userRows } = await db.query(`SELECT * FROM youco2 WHERE email = $1 ORDER BY id DESC LIMIT 20`,[
        email
    ]);
    // console.log(userRows);
    let values = [];
    let names = [];
    for (let i = 0; i < userRows.length; i++) {
        values.push(userRows[i].co2);
        names.push(userRows[i].name);
    }
    // console.log(values);
    // console.log(names);

   let { rows: allRows } = await db.query(`SELECT * FROM youco2 ORDER BY id DESC LIMIT 20`);
    // console.log(userRows);
    values = [];
    names = [];
    for (let i = 0; i < allRows.length; i++) {
        values.push(allRows[i].co2);
        names.push(allRows[i].name);
    }
    // console.log(values);
    // console.log(names);
 

    return(
        <>
            <MyChart values={values} names={names} />
            <button>Toggle</button>
            <Link href={`/quiz`}>New Entry</Link>
        </>
    )
}