import React, { useState } from "react";
import  Button  from "@mui/material/Button";
import { useRouter } from "next/router";
import style from "./settings.module.css";
import Signout from "../../public/Signoutbtn.png";
import Image from "next/image";

const Settings = () => {

const [loading, setLoading] = useState(false);
const router = useRouter();

return ( 
         <div className={style.Wrapper}> 
         <Image className="Image" style={{ marginTop: "6px", }} src={Signout}  width={30} height={30} alt="signout icon" />
         <Button
          style={{  marginRight: "20px"  }}
          className="text-2xl mt-1 normal-case"
          color="error"
          onClick={() => {
            setLoading(true); // Show loading while logging out
            router.replace("/api/auth/logout");
          }}
        >
          Log Out
        </Button>
      </div>
    );
 };
export default Settings;