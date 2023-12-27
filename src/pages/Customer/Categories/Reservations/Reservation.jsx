import { cipherRequest } from "../../../../services/KTSec/KTSec"
import config from "../../../../global.json"
import { useEffect } from "react"

export default function Reservation() {
    useEffect(() => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm")
        })

        cipherRequest(toSend, `${config.api}/reservation/getConfirmedReservationsOf`).then((res) => {
            console.log(res)
        })

        cipherRequest(toSend, `${config.api}/reservation/getActiveReservationsOf`).then((res) => {
            console.log(res)
        })
    }, [])
    
    return (
        <div>
            
        </div>
    )
}