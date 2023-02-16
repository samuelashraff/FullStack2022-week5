import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from './Blog'



test('Renders only blog title and author if not expanded', () => {
  const user = userEvent.setup()
  const mockHandler = jest.fn()
  const blog = {
    title: 'Test title',
    author: 'Author',
    url: 'www.TEST.com',
    likes: 3, 
    user: user
  }

  const component = render(<Blog blog={blog} user={user} updateLikes={mockHandler} removeBlog={mockHandler}/>)
  const element = screen.getByText('Test title Author')
  expect(element).toBeDefined()
  const fullBlog = component.container.querySelector('.fullBlog')
  expect(fullBlog).toBeNull()
})

test('Renders all if expanded', () => {
  const user = userEvent.setup()
  const mockHandler = jest.fn()
  const blog = {
    title: 'Test title',
    author: 'Author',
    url: 'www.test.com',
    likes: 3, 
    user: user
  }

  const component = render(<Blog blog={blog} user={user} updateLikes={mockHandler} removeBlog={mockHandler}/>)
  const button = component.getByText('view')
  fireEvent.click(button)
  const fullBlog = component.container.querySelector('.fullBlog')
  expect(fullBlog).toHaveTextContent('Test title')
  expect(fullBlog).toHaveTextContent('Author')
  expect(fullBlog).toHaveTextContent('www.TEST.com')
  expect(fullBlog).toHaveTextContent('likes 3')
})

test('Clicking like calls the proper function', async () => {
  const user = userEvent.setup()
  const mockHandler = jest.fn()
  const blog = {
    title: 'Test title',
    author: 'Author',
    url: 'www.test.com',
    likes: 3, 
    user: user
  }

  const component = render(<Blog blog={blog} user={user} updateLikes={mockHandler} removeBlog={mockHandler}/>)
  const fullviewButton = component.getByText('view')
  fireEvent.click(fullviewButton)
  const likebutton = component.getByText('like')
  fireEvent.click(likebutton)
  fireEvent.click(likebutton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})