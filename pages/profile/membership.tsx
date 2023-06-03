import React from 'react'
import Link from 'next/link'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { User } from '../../interfaces/interface'
import { ProfileNav, Wrapper } from '../../components/Home/home.styles'
import MembershipPage from '../../components/profilePage/membershipPage/membership'
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";


const Membership = ({ user }: User) => {
  return (
    <div>
        <ProfileNav>
            <Link href='/profile'><div className=''><ArrowBackRoundedIcon /></div></Link>
        <header>Membership Plans</header>
      </ProfileNav>
      <Wrapper>
      <MembershipPage user={user}/>
      </Wrapper>
        
    </div>
  )
}

export default Membership

export const getServerSideProps = withPageAuthRequired();
