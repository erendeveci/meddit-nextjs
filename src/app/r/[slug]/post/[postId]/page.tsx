import { db } from "@/lib/db";
import { Post, User, Vote } from "@prisma/client";
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
        <Suspense></Suspense>
      </div>
    </div>
  );
};

export default page;
