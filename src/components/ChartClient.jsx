"use client"

import {useState} from "react";
import MyChart from '@/components/MyChart'

export default function ChartClient({uservalues, usernames, allvalues, allnames}){

    const [isTrue, setIsTrue] = useState(true);

    const toggle = () => setIsTrue(prev => !prev);

    return(
        <>
            <MyChart
                key={isTrue ? "user" : "all"} values={isTrue ? uservalues : allvalues} names={isTrue ? usernames : allnames}
            />
            <button onClick={toggle}>{isTrue ? "All Users" : "Own Stats"}</button>
        </>
    )
}