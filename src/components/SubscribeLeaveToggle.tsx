"use client";
import React, { startTransition } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { SubscribeToSubredditPayload } from "@/lib/validators/subredit";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SubscribeLeaveToggleProps {
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
}

const SubscribeLeaveToggle = ({ subredditId, subredditName, isSubscribed }: SubscribeLeaveToggleProps) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post(`/api/subreddit/subscribe`, payload);
      return data as string;
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
      //this code block will be low priority,
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Subscribed",
        description: `You are now subscribed to r/${subredditName}`,
      });
    },
  });

  const { mutate: unsubscribe, isLoading: isUnSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post(`/api/subreddit/unsubscribe`, payload);
      return data as string;
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
      //startTransition will be low priority, this code block
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Unsubcribed",
        description: `You are now unsubscribed to r/${subredditName}`,
      });
    },
  });

  return isSubscribed ? (
    <Button onClick={() => unsubscribe()} isLoading={isUnSubLoading} className="w-full mt-1 mb-4">
      Leave community
    </Button>
  ) : (
    <Button onClick={() => subscribe()} isLoading={isSubLoading} className="w-full mt-1 mb-4">
      Join to post
    </Button>
  );
};

export default SubscribeLeaveToggle;
