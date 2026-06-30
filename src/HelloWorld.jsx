import React from 'react'

// Echo Hello World Component - Simple React Component
export default function HelloWorld() {
  const message = "Hello World"
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      <h1 style={{
        color: '#1e293b',
        fontSize: '48px',
        fontFamily: 'system-ui, sans-serif',
        margin: 0,
        padding: '20px'
      }}>
        {message}
      </h1>
    </div>
  )
}
