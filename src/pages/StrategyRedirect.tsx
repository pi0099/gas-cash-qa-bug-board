import { Navigate, useLocation } from 'react-router-dom'

/** Former top-nav pages → Strategy anchors */
export function ClaimGpsRedirect() {
  const { search } = useLocation()
  return <Navigate to={{ pathname: '/strategy', hash: 'claim-gps', search }} replace />
}

export function MobileCoopRedirect() {
  const { search } = useLocation()
  return <Navigate to={{ pathname: '/strategy', hash: 'mobile-coop', search }} replace />
}
