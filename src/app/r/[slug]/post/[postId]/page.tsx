import CommentsSection from "@/components/CommentsSection/CommentsSection";
import EditorOutput from "@/components/EditorOutput";
import PostVoteServer from "@/components/PostVote/PostVoteServer";
import { buttonVariants } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { formatTimeToNow } from "@/lib/utils";
import { Post, User, Vote } from "@prisma/client";
import { ArrowBigDown, ArrowBigUp, Divide, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

interface PageProps {
  params: { postId: string };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const page = async ({ params }: PageProps) => {
  const { postId } = params;

  let post: (Post & { votes: Vote[]; author: User }) | null = null;

  post = await db.post.findFirst({
    where: {
      id: postId,
    },
    include: {
      votes: true,
      author: true,
    },
  });

  if (!post) return notFound();

  return (
    <div>
      <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
        <Suspense fallback={<PostVoteShell />}>
          {/*  @ts-expect-error server component */}
          <PostVoteServer
            postId={post?.id}
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: params.postId,
                },
                include: {
                  votes: true,
                  author: true,
                },
              });
            }}
          />
        </Suspense>

        <div className="sm:w-0 w-full flex-1 bg-white p-4 rounded-sm">
          <p className="max-h-40 mt-1 truncate text-xs text-gray-500">
            Posted by u/{post?.author.name} {` `}
            {formatTimeToNow(new Date(post?.createdAt))}
          </p>
          <h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">{post?.title}</h1>
          <EditorOutput content={post?.content} />

          <Suspense
            fallback={
              <div className="py-4 w-full flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
              </div>
            }
          >
            {/*  @ts-expect-error server component */}
            <CommentsSection postId={post.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

function PostVoteShell() {
  return (
    <div className="flex items-center flex-col pr-6 w-20">
      <div
        className={buttonVariants({
          variant: "ghost",
        })}
      >
        <ArrowBigUp className="h-5 w-5 text-zinc-700" />
      </div>

      <div className="text-center py-2 font-medium text-sm text-zinc-900">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>

      <div
        className={buttonVariants({
          variant: "ghost",
        })}
      >
        <ArrowBigDown className="h-5 w-5 text-zinc-700" />
      </div>
    </div>
  );
}

export default page;
