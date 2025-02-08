// import React from 'react'
import AuthButton from './AuthButton'
import HeartRate from './HeartRate'
import StepsCount from './StepsCount'

export default function Health() {
  return (
    <div>
    <AuthButton/>
    <br />
    <br />
    <StepsCount/>
    <br />
    <br />
    <HeartRate/>
    </div>
  )
}
