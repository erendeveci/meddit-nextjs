import { formatTimeToNow } from "@/lib/utils";
import { Post, User, Vote } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";
import EditorOutput from "./EditorOutput";
import PostVoteClient from "./PostVote/PostVoteClient";

type PartialVote = Pick<Vote, "type">;

interface PostProps {
  subredditName: string;
  post: Post & {
    author: User;
    votes: Vote[];
  };
  commentAmt: number;
  votesAmt: number;
  currentVote?: PartialVote;
}

const Post: React.FC<PostProps> = ({ subredditName, post, commentAmt, votesAmt: _votesAmt, currentVote }) => {
  const pRef = useRef<HTMLDivElement>(null);

  return (
    <div className="rounded-md bg-white shadow  animate-fade animate-once animate-duration animate-ease-linear">
      <div className="px-6 py-4 flex justify-between">
        <PostVoteClient postId={post.id} initialVote={currentVote?.type} initialVotesAmt={_votesAmt} />
        <div className="flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {subredditName ? (
              <React.Fragment>
                <Link className="underline text-zinc-900 text-sm underline-offset-2" href={`/r/${subredditName}`}>
                  r/{subredditName}
                </Link>
                <span className="px-1">•</span>
              </React.Fragment>
            ) : null}
            <span>Posted by u/{post.author.username} </span>
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <Link href={`r/${subredditName}/post/${post.id}`}>
            <p className="text-lg font-semibold py-2 leading-6 text-gray-900">{post.title}</p>
          </Link>

          <div className="relative text-sm max-h-40 w-full overflow-clip" ref={pRef}>
            <EditorOutput content={post.content} />
            {pRef.current?.clientHeight === 160 ? <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" /> : null}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 z-20 text-sm px-4 py-4 sm:px-6">
        <a className="w-fit flex items-center gap-2" href={`/r/${subredditName}/post/${post.id}`}>
          <MessageSquare className="h-4 w-4" />
          {commentAmt}
        </a>
      </div>
    </div>
  );
};

export default Post;
