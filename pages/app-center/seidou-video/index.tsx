import { useState } from "react";
import { Onboarding } from "./components/Onboarding";
import { Feed } from "./components/Feed";
import Footer from "../Footer";

const SeidouVideo = () => {
    const [userInterests, setUserInterests] = useState([''])
    return ( 
        <>
            <div>
                {!userInterests? (
                    <Onboarding setUserInterests={setUserInterests}/>
                ):(
                    <Feed />
                )}
            </div>
            <Footer theme="dark"/>
        </>
     );
}
 
export default SeidouVideo;