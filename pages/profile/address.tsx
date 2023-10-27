import React from 'react';
import Link from 'next/link';
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { UseUser } from '@auth0/nextjs-auth0/dist/frontend/use-user'
import { ProfileNav, Wrapper } from '../../components/Home/home.styles'
import Addressbook from '../../components/profilePage/address/addressbook'
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const Address = () => {
  return (
    <>
    <div>
              <ProfileNav>
            <Link href='/profile'><div className=''><ArrowBackRoundedIcon /></div></Link>
        <header>Shipping</header>
      </ProfileNav>
      </div>
      <Wrapper>
      <Addressbook />
      </Wrapper>

      </>
  )
}

export default Address
export const getServerSideProps = withPageAuthRequired();