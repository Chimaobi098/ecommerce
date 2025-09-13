import { useRouter } from 'next/router';
import { ReactNode, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player'
import CheckIcon from '../../../../public/CheckIcon';
import CancelIcon from '../../../../public/CancelIcon';
import { fetchFromAPI } from '../../../../utils/seidouVideoUtils/FetchData';
import { CheckCircle, KeyboardArrowLeft } from '@mui/icons-material';
import Link from 'next/link';
import PayoutPopup from '../components/PayoutPopup';
import { useUser } from '@auth0/nextjs-auth0';
import useAppAuth from '../../../../utils/firebase';
const WatchVideo = () => {
    const { user } = useUser();
    const [activeVideoDetails, setActiveVideoDetails] = useState<{snippet: any, statistics: any}|null>(null);
    const [videos, setVideos] = useState<{id: any, snippet: any}[]|null>(null)
    const [popup, setPopup] = useState<{isExpanded: boolean, template: ReactNode | null}>({isExpanded: false, template: null})
    const router = useRouter();
    const { id } = router.query
    const initialPopup = useRef(true)
    const { getUserFromLocalStorage, updateFieldsInFirebase } = useAppAuth();
    const watchTimeInterval = useRef<any>()
    const watchTimeCounter = useRef(0)
    const watchTimeReward = useRef(1000)
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(()=>{
      // Clean up the interval when unmounting component
      return (()=> clearInterval(watchTimeInterval.current))
    }, [])

    useEffect(()=>{
      if(popup.isExpanded){
        // If the popup is visible, stop the watch time tracking.
        clearInterval(watchTimeInterval.current)
      } else if(isPlaying){
        // If the popup is closed and video is playing then continue the tracking
        trackWatchTime(true)
      }
    }, [popup])
    
    function trackWatchTime(videoIsPlaying: boolean){
      const timeToReward = 5 // In minutes
      
      if(videoIsPlaying){
        setIsPlaying(true)
        watchTimeInterval.current = setInterval(() => { // Interval increments watchTimeCounter every second
        watchTimeCounter.current += 1
          if(watchTimeCounter.current === timeToReward*60){
            rewardCheckpoint()
            watchTimeCounter.current = 1 // Reset the counter
            console.log('it ran')
          }
        }, 1000); // Run every 1 second

      } else {
        setIsPlaying(false)
        clearInterval(watchTimeInterval.current)
      }
  }

  function rewardCheckpoint(){
    // watchTimeReward.current += 1000
    setPopup({
        isExpanded: true, 
        template: (
          <div className="flex flex-col gap-y-2">
              <span className="text-base font-bold text-center leading-snug">You have been awarded some <br /> bidding currency.</span>
              <span className="text-center text-sm">Claim it now?</span>
              <div className="flex gap-x-3 text-sm w-full justify-center">
              <button className="rounded-md w-16 h-8 border-none bg-white flex justify-center items-center"
              onClick={()=>{addRewardToGameWallet()}}>
                  <CheckIcon />
              </button> 
              <button className="rounded-md w-16 h-8 border-none bg-white flex justify-center items-center"
              onClick={()=>{setPopup((prev)=> ({...prev, isExpanded: false}))}}>
                  <CancelIcon />
              </button>
              </div>
          </div>
        )
      })

      if(initialPopup.current){
        initialPopup.current = false // It will expand the first time automatically, every other time the user will have to open it
      }
  }

  async function addRewardToGameWallet(){
    const tempRewardValue = watchTimeReward.current
    setPopup((prev)=> ({...prev, template: 'Processing...'}))
    const userDetails = getUserFromLocalStorage()
    if(userDetails){
        const currentGameBalance = (JSON.parse(userDetails)).gameWalletBalance
        const res = await updateFieldsInFirebase(user?.email, {
          gameWalletBalance: currentGameBalance + tempRewardValue
        });

        if(!res){
          setPopup((prev)=> ({...prev, template: 'Something went wrong'}))
          return
        }

        setPopup((prev)=> ({...prev, template: 
        <div className='flex flex-col'>
          <span>Success!</span>
          <span className='font-bold text-base'>Auction wallet: ₦{currentGameBalance} + {tempRewardValue}</span>
        </div>, 
        }))

        setTimeout(() => {
          setPopup((prev)=> ({...prev, isExpanded: false}))
        }, 1500);

        watchTimeReward.current = 0 // Reset reward back to 0
    } 
    
    else {
      setPopup((prev)=> ({...prev, template: 'Failed: User not signed in'}))
    }


  }

    function decode(data: string) {
        const txt = document.createElement('textarea');
        txt.innerHTML = data;
        return txt.value;
    }
    
     useEffect(()=>{
        fetchFromAPI(`videos?part=snippet,statistics&id=${id}`)
        .then((data)=>setActiveVideoDetails(data.items[0]))
            
        fetchFromAPI(`search?part=snippet&relatedToVideoId=${id}&type=video`)
        .then((data) => setVideos(data.items))

    },[id])

    if(!activeVideoDetails?.snippet) return 'Loading...'

    const {snippet:{title,channelId,channelTitle}, statistics:{viewCount,likeCount}} = activeVideoDetails

    return ( 
        <div className="w-full max-w-[425px] h-[100dvh] bg-black overflow-scroll ">
            <PayoutPopup popup={popup} setPopup={setPopup}/>
            <div className='w-full text-white p-2' onClick={()=>{ router.push('/app-center/seidou-video/')}}>
                <KeyboardArrowLeft /> Back
            </div>
            <div className='sticky top-0 aspect-video w-full max-w-[425px] overflow-hidden'>
                <ReactPlayer url={`https://www.youtube.com/watch?v=${id}`}
                width="100%"
                height="100%"
                controls
                onPlay={()=>{trackWatchTime(true)}}
                onPause={()=>{trackWatchTime(false)}}
                onError={()=>{trackWatchTime(false)}}
                onEnded={()=>{trackWatchTime(false)}}/>
            </div>

            <div className='text-white'>
                <div className='px-3 mb-5 mt-1'>
                    <h2 className='font-bold'>{title}</h2>
                    <div className="flex flex-gap-x-1.5 items-center text-sm">
                        <span>{channelTitle.slice(0,60)}</span>
                        <CheckCircle sx={{fontSize:14, color:'gray', ml:'5px'}}/>
                    </div>
                </div>

                {/* Video Suggestions */}
                <div className="w-full flex flex-col items-center gap-y-7 px-3" >
                    {videos?.map((item, idx)=>{
                        return(
                        <Link key={idx} href={`/app-center/seidou-video/watch-video?id=${item.id.videoId}`} className="first:mt-[114px]">
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
            </div>
        </div>
     );
}
 
export default WatchVideo;