"use client"
import { useEffect } from "react"

export default function Redirect() {
    useEffect(() => {
        window.location.href = '/';
    }, []);
    return <div></div>
}