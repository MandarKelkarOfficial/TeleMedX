import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import RecentlyBookedDoctors from '../components/RecentlyBookedDoctors'

const Home = () => {
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <RecentlyBookedDoctors />
      <Banner />
    </div>
  )
}

export default Home