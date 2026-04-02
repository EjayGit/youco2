import MyChart from "@/components/MyChart"
import Link from "next/link"

export default function Profile(){
    return(
        <>
            <div>
                <h2>Your latest score is:</h2>
                <div></div>
            </div>
            <MyChart/>
            <button>Toggle</button>
            <Link href={`/quiz`}>New Entry</Link>
        </>
    )
}