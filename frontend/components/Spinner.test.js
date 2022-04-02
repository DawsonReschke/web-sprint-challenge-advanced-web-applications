// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react'
import { render, fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react'
import Spinner from './Spinner'

const spinner = ()=> document.querySelector('#spinner')

test('sanity', () => {
  expect(true).toBe(true)
})



test('spinner has correct opacity when NOT active',async()=>{
  render(<Spinner on={false}/>)
  expect(spinner()).toBeFalsy()
})
test('spinner has correct opacity when active',async()=>{
  render(<Spinner on={true}/>)
  expect(spinner()).toBeTruthy()
})