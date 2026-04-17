import "./Home.css";

export function Home() {
  const posts = [
    {
      id: 1,
      name: "John Doe",
      title: "Frontend Developer",
      content: "Just built a new React project 🚀",
      image: "https://picsum.photos/600/300",
    },
    {
      id: 2,
      name: "Anna Smith",
      title: "UI/UX Designer",
      content: "Design is not just how it looks, but how it works.",
      image: "https://picsum.photos/600/301",
    },
  ];

  return (
    <div className="feed-page">
      <div className="feed">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            
            {/* Header */}
            <div className="post-header">
              <div className="avatar"></div>
              <div>
                <h4>{post.name}</h4>
                <p>{post.title}</p>
              </div>
            </div>

            {/* Content */}
            <div className="post-content">
              <p>{post.content}</p>
            </div>

            {/* Image */}
            {post.image && (
              <img src={post.image} alt="post" className="post-image" />
            )}

            {/* Actions */}
            <div className="post-actions">
              <button>👍 Like</button>
              <button>💬 Comment</button>
              <button>🔗 Share</button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}