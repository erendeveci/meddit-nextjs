"use client";
import React, { useRef, useState } from "react";
import UserAvatar from "../UserAvatar";
import { Comment, CommentVote, User } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import CommentVotes from "../CommentsSection/CommentVotes";
import { Button } from "../ui/Button";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/Textarea";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios from "axios";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

interface PostCommentProps {
  comment: ExtendedComment;
  votesAmt: number;
  currentVote: CommentVote | undefined;
  postId: string;
}
const PostComment: React.FC<PostCommentProps> = ({ comment, votesAmt, currentVote, postId }) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };

      const { data } = await axios.patch(`/api/subreddit/post/comment`, payload);
      return data;
    },
  });
  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="h-8 w-8"
        />
        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900">u/{comment.author.name}</p>
          <p className="max-h-40 truncate text-xs text-zinc-500">{formatTimeToNow(new Date(comment.createdAt))}</p>
        </div>
      </div>
      <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>
      <div className="flex gap-2 items-center flex-wrap ">
        <CommentVotes initialVotesAmt={votesAmt} initialVote={currentVote} commentId={comment.id} />
        <Button
          onClick={() => {
            if (!session) return router.push("/sign-in");
            setIsReplying(true);
          }}
          variant="ghost"
          size="xs"
        >
          <MessageSquare className="h-4 w-4 mr-1.5" />
          Reply
        </Button>

        {isReplying ? (
          <div className="grid w-full gap-1.5 animate-fade-up animate-once animate-ease-linear">
            <Label htmlFor="comment">Your Comment</Label>
            <div className="mt-2">
              <Textarea id="comment" value={input} onChange={(e) => setInput(e.target.value)} rows={1} placeholder="What are your thoughts?" />
            </div>
            <div className="mt-2 flex justify-end">
              <Button
                onClick={() => postComment({ postId, text: input, replyToId: comment.replyToId ?? comment.id })}
                disabled={isLoading || input.length === 0}
                isLoading={isLoading}
              >
                Post
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PostComment;
