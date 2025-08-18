import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { fetchFromAPI } from "../Utils/FetchData";
import Link from "next/link";
import { CheckCircle } from "@mui/icons-material";
import Footer from "../../Footer";

const SearchFeed = () => {
    const [videos, setVideos] = useState<{id: any, snippet: any}[]|null>(null)
    const [searchTerm, setSearchTerm] = useState('')

     function decode(data: string) {
        const txt = document.createElement('textarea');
        txt.innerHTML = data;
        return txt.value;
    }
    
    useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get('query')
    setSearchTerm(query ?? '—')

    fetchFromAPI(`search?part=snippet&q=${query}`)
     .then((data)=>{setVideos(data.items)})

 
   }, [])

    return ( 
        <div className="bg-black h-[100dvh] overflow-scroll w-full px-3 pb-[15vmin]">
            <Header />
            <h2 className="font-medium text-lg mt-[60px] h-fit text-white">Search results for: <span className="text-xl text-red-500"> {searchTerm}</span></h2>
            <div className="flex flex-col items-center gap-y-7 mt-2">
                {videos?.map((item, idx)=>{
                    return(
                        <Link key={idx} href={`/app-center/seidou-video/watch-video?id=${item.id.videoId}`} className="">
                        <div className="w-full sm:w-[358px] md:w-[239px]">
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
            <Footer theme="dark"/>
        </div>
     );
}
 
export default SearchFeed;