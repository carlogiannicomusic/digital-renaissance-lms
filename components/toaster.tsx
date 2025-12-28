'use client'

import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        style: {
          fontFamily: '"Proxima Nova", "Helvetica Neue", "Avenir", system-ui, sans-serif',
          fontWeight: '600',
          border: '2px solid #000000',
        },
        classNames: {
          toast: 'bg-dr-white border-dr-black',
          title: 'text-dr-black font-bold uppercase',
          description: 'text-dr-black',
          success: 'bg-dr-green text-dr-white',
          error: 'bg-dr-peach text-dr-white',
          warning: 'bg-dr-yellow text-dr-black',
          info: 'bg-dr-blue text-dr-white',
        },
      }}
    />
  )
}
