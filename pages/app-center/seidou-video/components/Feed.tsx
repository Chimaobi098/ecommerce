import { useEffect, useRef, useState } from "react";
import { Header } from "./Header";
import { fetchFromAPI } from "../Utils/FetchData";
import Link from "next/link";
import { CheckCircle } from "@mui/icons-material";

type Props = {
 
}
export const Feed = ({}: Props) => {
    const [selectedCategory, setSelectedCategory] = useState('New')
    const [videos, setVideos] = useState<{id: any, snippet: any}[]|null>(null)
    const [fullHeader, setFullHeader] = useState(true)
    const lastScrollValue = useRef(0)

    function checkScrollDirection(){
    const feed: HTMLElement|null = document.querySelector('.feed')
    const newScrollValue = feed?.scrollTop || 0
    if(Math.abs(newScrollValue - lastScrollValue.current) < 20){
      return // Don't even bother if scrolling displacement is less than 20 to minimize unnecessary triggers
    }
    if((newScrollValue >= lastScrollValue.current) && (newScrollValue >= 100)){
      setFullHeader(false)
    } else {
      setFullHeader(true)
    }
    lastScrollValue.current = newScrollValue
  }

    function decode(data: string) {
        const txt = document.createElement('textarea');
        txt.innerHTML = data;
        return txt.value;
    }

    useEffect(()=>{
    fetchFromAPI(`search?part=snippet&q=${selectedCategory}`)
        .then((data)=>{setVideos(data.items)})

    }, [selectedCategory])
    return ( 
        <>
            <Header
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory}
            fullHeader={fullHeader}
            />

            {/* VIDEOS */}
            <div className="feed h-[100dvh] overflow-scroll w-full bg-black flex flex-col items-center gap-y-7 px-3" 
            onScroll={()=> checkScrollDirection()}>
                {videos?.map((item, idx)=>{
                    return(
                        <Link key={idx} href={`/app-center/seidou-video/watch-video?id=${item.id.videoId}`} className="">
                        <div className="w-full sm:w-[358px] md:w-[239px] first:mt-[114px]">
                            <img src={item.snippet?.thumbnails?.high?.url} className="w-full h-[180px] object-cover rounded-t-2xl"/>
                            <div className="pt-3 pb-5 px-3 rounded-b-2xl text-white bg-[#1a1a1a] flex flex-col gap-y-1">
                                <span className="overflow-hidden">{item.snippet?.title.length >= 70? `${decode(item.snippet?.title).slice(0,70)}...` : decode(item.snippet?.title)}</span>
                                <Link href={`/app-center/seidou-video/channel?${item.snippet?.channelId}`}>
                                    <div className="flex flex-gap-x-1.5 items-center text-sm">
                                    <span>{item.snippet?.channelTitle.slice(0,60)}</span>
                                    <CheckCircle sx={{fontSize:14, color:'gray', ml:'5px'}}/>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        </Link>
                    )
                })
                }
            </div>
        </>
    );
}