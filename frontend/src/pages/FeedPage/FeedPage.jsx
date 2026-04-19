import { useEffect, useState } from "react";
import "./FeedPage.css";
import { useSelector } from "react-redux";

import CreatePost from "./components/CreatePost";
import PostCard from "./components/PostCard";

export function FeedPage() {
    const { path } = useSelector((state) => state.path);
    const { timeLeft } = useSelector((state) => state.user_data);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);

    const fetchPosts = async (p = 1) => {
        const res = await fetch(
            `${path}/posts?page=${p}&limit=10`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`
                }
            }
        );

        const data = await res.json();

        if (p === 1) setPosts(data);
        else setPosts(prev => [...prev, ...data]);
    };

    useEffect(() => {
        const getPosts = () => {
            fetchPosts(1);
        }
      timeLeft > 0 &&  getPosts()

    }, []);

    return (
        <div className="feed-container">
            <h2 className="feed-title">Cyber Learning Feed</h2>

            <CreatePost onPostCreated={() => fetchPosts(1)} />

            {posts.map(p => (
                <PostCard
                    key={p.id}
                    post={p}
                    onRefresh={() => fetchPosts(page)}
                />
            ))}

            <button
                className="cyber-btn"
                onClick={() => {
                    const next = page + 1;
                    setPage(next);
                    fetchPosts(next);
                }}
            >
                Load More
            </button>
        </div>
    );
}