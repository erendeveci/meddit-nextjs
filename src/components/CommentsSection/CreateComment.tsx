"use client";
import React, { startTransition, useState } from "react";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useRouter } from "next/navigation";

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
}

const CreateComment: React.FC<CreateCommentProps> = ({ postId, replyToId }) => {
  const [input, setInput] = useState<string>("");
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };

      const { data } = await axios.patch(`/api/subreddit/post/comment`, payload);
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast();
        }
        if (error.response?.status === 400) {
          return toast({
            title: "There was a problem",
            description: "You are already subscribed to this subreddit",
            variant: "destructive",
          });
        }
      }

      return toast({
        title: "There was a problem",
        description: "Something went wrong, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setInput("");

      startTransition(() => {
        toast({
          title: "Successful",
          description: `Your comment has been published`,
        });
      });
    },
  });
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment">Your Comment</Label>
      <div className="mt-2">
        <Textarea id="comment" value={input} onChange={(e) => setInput(e.target.value)} rows={1} placeholder="What are your thoughts?" />
      </div>
      <div className="mt-2 flex justify-end">
        <Button onClick={() => comment({ postId, text: input, replyToId })} disabled={isLoading || input.length === 0} isLoading={isLoading}>
          Post
        </Button>
      </div>
    </div>
  );
};

export default CreateComment;
