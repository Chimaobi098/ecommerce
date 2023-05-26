import React from 'react'
import Link from 'next/link'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { User } from '../../interfaces/interface'
import { ProfileNav, Wrapper } from '../../components/Home/home.styles'
import Addressbook from '../../components/profilePage/address/addressbook'
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const Address = ({ user }: User) => {
  return (
    <>
    <div>
              <ProfileNav>
            <Link href='/profile'><div className=''><ArrowBackRoundedIcon /></div></Link>
        <header>Shipping</header>
      </ProfileNav>
      </div>
      <Wrapper>
      <Addressbook user={user}/>
      </Wrapper>

      </>
  )
}

export default Address
export const getServerSideProps = withPageAuthRequired();