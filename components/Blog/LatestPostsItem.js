import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/router";

function LatestPostsItem(props) {
  const post = props.post;
  const isMobile = props.isMobile;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <div
      className={`rounded col-6 col-md-3 pointer opacity-${loading ? "50" : "100"}`}
      onClick={() => {
        if (!loading) {
          router.push({
            pathname: "/blog/[pid]",
            query: { pid: post.id },
            hash: "main",
          });
        }
        setLoading(true);
      }}
    >
      <div className="w-100" style={{ position: "relative", height: "150px" }}>
        <Image src={post.mainImg.path} fill alt={post.title} style={{ objectFit: "cover", borderRadius: ".25rem" }} />
      </div>
      <span>
        <strong>{post.title}</strong>
      </span>
    </div>
  );
}

export default LatestPostsItem;
