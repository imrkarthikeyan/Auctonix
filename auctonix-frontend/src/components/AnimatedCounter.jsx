import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({value}){

    const [count,setCount]=useState(0);
    const ref=useRef(null);
    const started=useRef(false);

    useEffect(()=>{
        setCount(0);
        started.current=false;
    },[value]);

    useEffect(()=>{
        if(value<=0) return;

        const observer=new IntersectionObserver(
            ([entry])=>{
                if(entry.isIntersecting && !started.current){
                    started.current=true;

                    const duration=1500;
                    const stepTime=Math.max(10, duration/value);

                    let current=0;

                    const interval=setInterval(()=>{
                        current+=1;
                        setCount(current);
                        if(current>=value){
                            clearInterval(interval);
                        }
                    },stepTime)
                }
            },
            {threshold:0.4}
        )

        if(ref.current) observer.observe(ref.current);
        return()=>observer.disconnect();
    },[value]);

    return(
        <h2
            ref={ref}
            className="text-7xl font-bold text-[#0b2a55]"
        >
            {count}
        </h2>
    )
}