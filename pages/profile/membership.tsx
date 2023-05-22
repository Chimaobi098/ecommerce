import React from 'react'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { User } from '../../interfaces/interface'
import { NavBar } from '../../components/Home/home.styles'
import MembershipPage from '../../components/profilePage/membershipPage/membership'
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";


const Membership = ({ user }: User) => {
  return (
    <div>
        <NavBar>
            {/* <div className='text-left'><ArrowBackRoundedIcon /></div> */}
        <header>Membership Plans</header>
      </NavBar>
      <MembershipPage user={user}/>
        
    </div>
  )
}

export default Membership

export const getServerSideProps = withPageAuthRequired();
