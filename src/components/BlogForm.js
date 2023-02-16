import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    const blogObj = {
      title: title,
      author: author,
      url: url
    }
    createBlog(blogObj)

  }


  return (
    <form onSubmit={addBlog}>
      <h1>create new</h1>
      <div>
        title:
        <input
          type="text"
          value={title}
          name="title"
          onChange={({ target }) => setTitle(target.value)}
          id='title-input'
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={author}
          name="author"
          onChange={({ target }) => setAuthor(target.value)}
          id='author-input'
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={url}
          name="url"
          onChange={({ target }) => setUrl(target.value)}
          id='url-input'
        />
      </div>
      <button id='create' type="submit">create</button>
    </form>
  )

}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}


export default BlogForm