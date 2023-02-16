import { useState } from 'react'
import PropTypes from 'prop-types'


const Blog = ({ blog, updateLikes, removeBlog, user }) => {

  const [showDetails, setShowDetails] = useState(false)

  return (
    <div>
      {showDetails ?
        <div className='full_blog'>
          <p>{blog.title} {blog.author}<button id='hideDetails' onClick={() => setShowDetails(false)}>hide</button></p>
          <p>{blog.url}</p>
          <p>likes {blog.likes} <button id='like' onClick={() => updateLikes(blog)}>like</button></p>
          <p>{blog.user.name}</p>
          {blog.user.username === user.username && (
            <button id='remove' onClick={() => removeBlog(blog)}>remove</button>
          )}
        </div>
        :
        <div className='blog'>
          {blog.title} {blog.author} <button id='showDetails' onClick={() => setShowDetails(true)}>view</button>
        </div>
      }
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateLikes: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog