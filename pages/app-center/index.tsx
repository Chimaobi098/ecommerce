import Link from "next/link";
import Footer from "./AC_Footer";
import { KeyboardArrowLeft, PlayArrow, PlayArrowRounded, YouTube } from "@mui/icons-material";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { Gamepad, Gamepad2, LucideGamepad2 } from "lucide-react";

const AppCenter = () => {
    const router = useRouter()
    const { user } = useUser();

    function handleRouting(route: string){
        // if(!user){
        //     alert('Oops, you need to log in to access the apps')
        // } else {
        //     router.push(route)
        // }

        router.push(route)
    }

    return ( 
        <>
            <div className="fixed top-0 z-20 text-2xl w-full flex justify-center items-center font-bold h-[60px] bg-white border-b border-[#cccccc]">
                <div onClick={()=>{ router.push('/')}} className="absolute left-0 h-full w-[10%] px-1 flex items-center">
                    <KeyboardArrowLeft className="text-[32px]"/>
                </div> 
                <span>App Center</span>
            </div>
            <div className="flex flex-col items-center justify-center h-[100dvh] pt-[60px]">
                <div onClick={()=>{handleRouting('/app-center/seidou-video')}} style={{clipPath: 'polygon(100% 0%, 100% calc(100% - 20px), 0% 100%, 0% 0%)'}}
                className="w-[90%] aspect-[1/0.7] rounded-t-lg max-w-[400px] bg-gray-900 flex flex-col justify-center items-center gap-y-5 active:scale-110 duration-150">
                    <PlayArrowRounded className="text-[52px] text-white"/>
                    <span className="text-white font-medium text-lg">Seidou Video</span> 
                </div>
                <div onClick={()=>{handleRouting('/app-center/arcade')}} style={{clipPath: 'polygon(100% 0%, 100% 100%, 0% 100%, 0% 20px)'}}
                className="w-[90%] aspect-[1/0.7] rounded-b-lg max-w-[400px] bg-gray-900 flex flex-col justify-center items-center gap-y-5 active:scale-110 duration-150">
                    <LucideGamepad2 size={52} stroke="white"/>
                    <span className="text-white font-medium text-lg">Arcade</span> 
                </div>
            </div>
            {/* <Footer theme='light'/> */}
        </>
     );
}
 
export default AppCenter;