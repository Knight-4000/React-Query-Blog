import { useState, useEffect } from "react";

import { PostDetail } from "./PostDetail";
import { useQuery, useQueryClient } from "react-query";

// 100 posts in api so 10 pages of 10 posts each. Here and on line 11.
const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}

export function Posts(pageNum) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if(currentPage < maxPostPage) {
    const nextPage = currentPage + 1;
    queryClient.prefetchQuery(["posts", nextPage], () => fetchPosts(nextPage));
    }
  }, [currentPage, queryClient]);


  // replace with useQuery
  const {data, isError, error, isLoading} = useQuery(
    ["posts", currentPage], 
  () => fetchPosts(currentPage), { 
    staleTime: 2000,
  // In case someone wants to go back to a previous page
  keepPreviousData: true,
  });

  // If fetchPosts has not resolved data yet, early return a div
  // But when fetchPosts resolves, now we can map the data.
if (isLoading) return <h3>Loading...</h3>;
if (isError) return <><h3>Me not know what me doing</h3><p>{error.toString()}</p></>

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled={currentPage <= 1} onClick={() => {setCurrentPage((previousValue) => previousValue - 1);
        }}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button disabled={currentPage >= maxPostPage} onClick={() => {setCurrentPage((previousValue) => previousValue + 1);
        }}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
