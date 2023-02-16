import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationStyle, setNotificationStyle] = useState('success')


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((x, y) => x.likes - y.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()


  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      const notificationMessage = `A new blog ${newBlog.title} by ${newBlog.author} added`
      setBlogs(blogs.concat(newBlog))
      // reload blogs to get user links to load as well
      const blogsReloaded = await blogService.getAll()
      setBlogs(blogsReloaded.sort((a, b) => b.likes - a.likes))
      blogFormRef.current.toggleVisibility()
      setErrorMessage(notificationMessage)
      setNotificationStyle('success')
      setTimeout(() => {
        setErrorMessage(null)
        setNotificationStyle('success')
      }, 5000)

    } catch (error) {
      setErrorMessage('an error occured')
      setNotificationStyle('error')
      setTimeout(() => {
        setErrorMessage(null)
        setNotificationStyle('success')
      }, 5000)
    }

  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setNotificationStyle('error')
      setTimeout(() => {
        setErrorMessage(null)
        setNotificationStyle('success')
      }, 5000)
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }


  const handleLike = async (blog) => {
    const newBlog = { ...blog, likes: blog.likes + 1 }
    await blogService.update(newBlog)
    const updatedBlogs = blogs.map(currBlog => currBlog.id === blog.id ? newBlog : currBlog )
      .sort((a, b) => b.likes - a.likes)
    setBlogs(updatedBlogs)
  }

  const handleRemove = async (blog) => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      try {
        await blogService.remove(blog)
        let notificationMsg = `Removed blog ${blog.title} by ${blog.author}`
        setBlogs(blogs.filter(b => b.id !== blog.id))
        setErrorMessage(notificationMsg)
        setNotificationStyle('success')
        setTimeout(() => {
          setErrorMessage(null)
          setNotificationStyle('success')
        }, 5000)
      } catch (error) {
        setErrorMessage(`Removing blog ${blog.title} by ${blog.author} failed`)
        setNotificationStyle('error')
        setTimeout(() => {
          setErrorMessage(null)
          setNotificationStyle('success')
        }, 5000)
      }

    }

  }


  return (
    <div>
      {user === null ?
        <div>
          <h2>Log in to application</h2>
          <Notification message={errorMessage} styles={notificationStyle} />
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </div>
        :
        <div>
          <h2>blogs</h2>
          <Notification message={errorMessage} style={notificationStyle} />
          <p>
            {user.name} logged in
            <button id='logout' onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} updateLikes={handleLike} removeBlog={handleRemove} user={user} />
          )}
        </div>
      }
    </div>
  )




}

export default App
