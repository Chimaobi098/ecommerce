import React from 'react';
import Link from 'next/link';
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { UseUser } from '@auth0/nextjs-auth0/dist/frontend/use-user'
import { ProfileNav, Wrapper } from '../../components/Home/home.styles'
import Addressbook from '../../components/profilePage/address/addressbook'
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useRouter } from 'next/router';

const Address = () => {
  const router = useRouter()
  return (
    <>
    <div>
              <ProfileNav>
         <div  onClick={()=>router.back()}><ArrowBackRoundedIcon /></div>
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