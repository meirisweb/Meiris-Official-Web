import React from 'react'

export default function PreviewIFrame(props: any) {
  return (
    <iframe
      src="http://localhost:3000/en/insights"
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  )
}
