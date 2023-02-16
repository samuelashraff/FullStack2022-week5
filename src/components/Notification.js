

const Notification = ({ message, styles }) => {
    if (message === null) return null

    return (
        <div className={styles}>
            {message}
        </div>
    )
}

export default Notification