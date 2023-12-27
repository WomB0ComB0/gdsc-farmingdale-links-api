import React from 'react'
// <{ props?: React.SVGAttributes<SVGElement> }>
const GdscLogo: React.FC = (): JSX.Element => {
  return (
    <svg fill="none" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox='0 0 512 512' style={{
      height: '4rem',
      width: '4rem'
    }}>
      <rect x="33" y="242.514" width="206.171" height="73" rx="36.5" transform="rotate(-29.497 33 242.514)" fill="#EA4336" />
      <rect x="67.6865" y="207" width="206.171" height="73" rx="36.5" transform="rotate(30.1692 67.6865 207)" fill="#4286F5" />
      <rect width="206.171" height="73" rx="36.5" transform="matrix(-0.864545 0.502555 0.502555 0.864545 444.705 207)" fill="#FABC05" />
      <rect width="206.171" height="73" rx="36.5" transform="matrix(-0.870382 -0.492378 -0.492378 0.870382 481.391 242.514)" fill="#0D9D58" />
    </svg>
  )
}
export default GdscLogo
