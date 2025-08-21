import { Dispatch, SetStateAction, useState } from "react";
import { Search, YouTube } from "@mui/icons-material";
import { useRouter } from "next/router";
import useCategories from "../../../../utils/seidouVideoUtils/UseCategories";

type Props = {
 selectedCategory?: string;
 setSelectedCategory?: Dispatch<SetStateAction<string>>;
 fullHeader?: boolean;
}
const Header = ({selectedCategory, setSelectedCategory, fullHeader=true}: Props) => {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()
  const categories = useCategories()
   
  function handleSearch(){
    if(searchTerm){
      router.push(`/app-center/seidou-video/search?query=${searchTerm}`)
      // setSearchTerm('')
    }
  }
    return ( 
            <div className={`fixed text-white top-0 left-0 z-10 bg-[#000000c5] backdrop-blur-md w-full max-w-[450px] duration-[0.35s] ${!fullHeader? '-translate-y-[60px]':''}`}>
              <div className="h-[60px] flex gap-x-4 items-center justify-between px-5 pt-[15px] pb-[5px]">
                <h1 onClick={()=>{router.push('/app-center/seidou-video')}}>Seidou Video</h1>
                <div className="rounded-xl grow max-w-[200px] border border-[#404040] h-9 bg-transparent overflow-hidden flex items-center">
                  <input type="text" 
                  value={searchTerm}
                  placeholder="Search"
                  onChange={(e)=>{setSearchTerm(e.target.value)}} 
                  className="w-full h-full px-3 text-white grow bg-transparent focus:outline-none"/>
                  <button onClick={()=>{handleSearch()}} className="h-full w-12 grid place-content-center bg-[#ffffff10] rounded-l-xl">
                    <Search className="text-2xl text-white"/>
                  </button>
                </div>
              </div>
      
              {/* Categories */}
              {setSelectedCategory && <div className={`w-full flex items-center px-2`}>
                <div className="no-scrollbar fade-right py-2.5 w-full h-full flex grow gap-x-3 overflow-x-scroll snap-x snap-mandatory">
                  {categories.map((category)=>{
                  return( 
                      <button className={`category-btn flex items-center shrink-0 px-4 py-1 rounded-lg gap-x-2 w-fit ${category.name === selectedCategory? 'bg-red-600' : 'border border-[#404040]'}`} onClick={()=>{setSelectedCategory? setSelectedCategory(category.name): null}} 
                      key={category.name}>
                          <span className={`text-white`}>{category.name}</span>
                      </button>
                  )
                  })}
                </div>
              </div>}
            </div>
    );
}

export default Header