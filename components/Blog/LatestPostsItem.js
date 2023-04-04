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
      className={`rounded col-7 col-md-3 pointer overflow-hidden opacity-${loading ? "50" : "100"}`}
      style={{maxWidth: 220, textOverflow: "ellipsis"}}
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
      <span style={{whiteSpace: "nowrap"}}>
        {post.title}
      </span>
    </div>
  );
}

export default LatestPostsItem;
