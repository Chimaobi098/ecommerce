import { Apps, YouTube } from "@mui/icons-material";
import Link from "next/link";
import { ShoppingBagIcon } from "../../public/ShoppingBag";

interface props {
    theme: 'light'|'dark'
}
const AC_Footer = ({theme}: props) => {
    const baseURL = '/app-center'
    const apps = [
        {name: 'Seidou', route: '/', icon: <ShoppingBagIcon fill={`${theme==='light'? 'black':'white'}`}/>},
        {name: 'App center', route: `${baseURL}`, icon: <Apps className={`text-[30px] ${theme==='light'? 'black':'text-white'}`}/>}
    ]
    return ( 
        <div className={`fixed bottom-0 left-0 ${theme==='light'? 'bg-white':'bg-black'} border-t border-[#cccccc] h-[60px] z-[90] w-full max-w-[450px] flex justify-around items-center px-8`}>
            {apps.map((app, index)=>{
                return(
                    <Link key={index} href={`${app.route}`}>
                        <div className={`flex flex-col justify-between items-center ${theme==='light'? 'black':'text-white'}`}>
                            <span>{app.icon}</span>
                            <span className="text-sm font-bold">{app.name}</span>
                        </div>
                    </Link>
                )
            })}
        </div>
     );
}
 
export default AC_Footer;