import dynamic from "next/dynamic";
// import CrashPage from "./crash/page";

const CrashGame2 = dynamic(() => import("../components/CrashGame2/App"), {
    ssr: false,
});

export default function Crash2Page() {
    return (
        <div  style={{
            overflowY: "auto",
            maxHeight: "100vh",
        }}>
            <CrashGame2/>
            <div className="h-14"></div>
        </div>
    )
}