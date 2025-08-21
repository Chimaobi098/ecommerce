import { useEffect, useState } from "react";
import Header from "../components/Header";
import { fetchFromAPI } from "../../../../utils/seidouVideoUtils/FetchData";
import Link from "next/link";
import { CheckCircle } from "@mui/icons-material";
import Footer from "../../AC_Footer";

const ChannelPage = () => {
    const [videos, setVideos] = useState<{id: any, snippet: any}[]|null>(null)
    const [channelDetails, setChannelDetails] = useState<any|null>(null)

     function decode(data: string) {
        const txt = document.createElement('textarea');
        txt.innerHTML = data;
        return txt.value;
    }

    function formatNumber(num: number) {
    if (num === null || num === undefined) return "0";

    const absNum = Math.abs(num);

    if (absNum >= 1.0e9) {
        return (num / 1.0e9).toFixed(1).replace(/\.0$/, "") + "B"; // Billion
    } else if (absNum >= 1.0e6) {
        return (num / 1.0e6).toFixed(1).replace(/\.0$/, "") + "M"; // Million
    } else if (absNum >= 1.0e3) {
        return (num / 1.0e3).toFixed(1).replace(/\.0$/, "") + "K"; // Thousand
    } else {
        return num.toString();
    }
    }
    
    useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')

    fetchFromAPI(`channels?part=snippet,brandingSettings,statistics&id=${id}`)
    .then((data)=> {console.log(data), setChannelDetails(data?.items[0])})
       
    fetchFromAPI(`search?channelId=${id}&part=snippet&order=date`)
    .then((data)=> setVideos(data?.items))
 
   }, [])

    return ( 
        <div className="bg-black h-[100dvh] overflow-scroll w-full px-3 pb-[15vmin]">
            <Header />
            <div style={{backgroundImage: `url(${channelDetails?.brandingSettings?.image?.bannerExternalUrl})`}} 
            className="h-40 w-full bg-gray mt-[60px] bg-[#1a1a1a] relative bg-center bg-cover bg-no-repeat rounded-xl">
                <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-8 w-full flex flex-col items-center text-white">
                    <img src={channelDetails?.snippet?.thumbnails?.default?.url} alt="channel profile icon" 
                    className="w-16 h-16 bg-white rounded-full object-cover outline outline-2 outline-black"/>
                    <span className="font-bold text-2xl text-center">{`${channelDetails?.snippet?.title ?? '---'}`}</span>
                    <span className=" whitespace-nowrap">{formatNumber(channelDetails?.statistics?.subscriberCount)} subscribers • {formatNumber(channelDetails?.statistics?.videoCount)} videos</span>
                </div>
            </div>
            <div className="flex flex-col items-center gap-y-7 mt-28">
                {videos?.map((item, idx)=>{
                    return(
                        <Link key={idx} href={`/app-center/seidou-video/watch-video?id=${item.id.videoId}`} className="">
                        <div className="w-full sm:w-[358px] md:w-[239px]">
                            <img src={item.snippet?.thumbnails?.high?.url} className="w-full h-[180px] object-cover rounded-t-2xl"/>
                            <div className="pt-3 pb-5 px-3 rounded-b-2xl text-white bg-[#1a1a1a] flex flex-col gap-y-1">
                                <span className="overflow-hidden">{item.snippet?.title.length >= 70? `${decode(item.snippet?.title).slice(0,70)}...` : decode(item.snippet?.title)}</span>
                                <Link href={`/app-center/seidou-video/channel?id=${item.snippet?.channelId}`}>
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
            <Footer theme="dark"/>
        </div>
     );
}
 
export default ChannelPage;