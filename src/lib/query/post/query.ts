import prisma from "@/db";
import { AccountType, PostModel, PostType } from "@/lib/models";
import { extractHashtags } from "@/lib/utils";

export async function getPostForNewsFeed() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
      likes: true,
      comments: true,
      shares: true,
    },
  });

  return posts;
}

export async function getFollowerCount(userId: number) {
  return prisma.follower.count({
    where: { authorId: userId },
  });
}

export async function getFollowingCount(userId: number) {
  return prisma.follower.count({
    where: { followerId: userId },
  });
}

export async function getUserPosts(userId: number) {
  const userPosts = await prisma.post.findMany({
    where: { authorId: userId },
    include: {
      likes: true,
      comments: true,
      shares: true,
      author: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const followerCount = await getFollowerCount(userId);
  const followingCount = await getFollowingCount(userId);
  return { userPosts, followerCount, followingCount };
}

export async function getHashTagPosts(hashtag: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        hashtags: {
          contains: hashtag, // Search for the exact hashtag
        },
      },
      include: {
        author: true,
        likes: true,
        comments: true,
        shares: true,
      },
    });
    return posts;
  } catch (error) {
    console.error("Error fetching posts by hashtag:", error);
    throw new Error("Error fetching posts");
  }
}

export async function getFollowStatus(
  authorId: number,
  userId: number
): Promise<boolean> {
  const followRecord = await prisma.follower.findFirst({
    where: {
      authorId: authorId,
      followerId: userId,
    },
  });

  return followRecord !== null;
}

export async function toggleFollow(authorId: number, followerId: number) {
  try {
    // Check if the follow relationship already exists
    const followRecord = await prisma.follower.findFirst({
      where: {
        authorId: authorId,
        followerId: followerId,
      },
    });

    console.log("Follow record:", followRecord);

    if (followRecord) {
      // If exists, unfollow (delete the record)
      await prisma.follower.delete({
        where: {
          id: followRecord.id,
        },
      });
      console.log("Unfollowed successfully");
    } else {
      // If not exists, follow (create the record)
      await prisma.follower.create({
        data: {
          authorId: authorId,
          followerId: followerId,
        },
      });
      console.log("Followed successfully");
    }
    return true;
  } catch (error) {
    console.error("Failed to toggle follow status", error);
    return false;
  }
}

export async function getFollowers(userId: number) {
  const followers = await prisma.follower.findMany({
    where: { authorId: userId },
    include: { follower: true },
  });
  return followers.map((f) => f.follower.username);
}

export async function getFollowing(userId: number) {
  const following = await prisma.follower.findMany({
    where: { followerId: userId },
    include: { author: true },
  });
  return following.map((f) => f.author.username);
}

// export async function insertPostByUsername(
//   authorId: number,
//   postType: PostType,
//   title: string,
//   content: string
// ) {
//   const insertedPost = await prisma.post.create({
//     data: {
//       title: title,
//       content: content,
//       authorId: authorId,

//     },
//     include: {
//       author: true,
//       likes: true,
//       comments: true,
//       shares: true,
//       hashtags: true,
//     },
//   });
//   return insertedPost;
// }

export async function insertPostByUsername(
  authorId: number,
  postType: PostType,
  title: string,
  content: string
) {
  // Validate title to prevent hashtags
  const hashtagRegex = /#\w+/g;
  if (hashtagRegex.test(title)) {
    throw new Error("Hashtags are not allowed in the title.");
  }
  const hashtagsArray = extractHashtags(content);
  const hashtags = hashtagsArray.join(",");
  const cleanedContent = content
    .replace(/#\w+/g, "")
    // .replace(/\s+/g, " ")
    .trim();

  const post = await prisma.post.create({
    data: {
      title: title,
      content: cleanedContent,
      authorId: authorId,
      hashtags: hashtags,
    },
    include: {
      author: true,
      likes: true,
      comments: true,
      shares: true,
    },
  });

  return post;
}

interface UpdatePostResponse {
  isEdited: boolean;
  updatedPost?: PostModel;
  message: string;
}

export async function UpdatePostById(
  postId: number,
  userId: number,
  postTitle: string,
  postContent: string
  // postHashtags: string
): Promise<UpdatePostResponse> {
  let isEdited = false;
  let message =
    "Failed to update the post. Post does not exist or unauthorized access.";
  let updatedPost: PostModel | undefined = undefined;

  // Validate title to prevent hashtags
  const hashtagRegex = /#\w+/g;
  if (hashtagRegex.test(postTitle)) {
    return { isEdited, message: "Hashtags are not allowed in the title." };
  }

  const post = await prisma.post.findFirst({
    where: { id: postId, authorId: userId },
  });
  if (post) {
    const hashtagsArray = extractHashtags(postContent);
    const hashtags = hashtagsArray.join(",");
    const cleanedContent = postContent
      .replace(/#\w+/g, "")
      // .replace(/\s+/g, " ")
      .trim();
    updatedPost = (await prisma.post.update({
      where: { id: postId },
      data: { title: postTitle, content: cleanedContent, hashtags: hashtags },
    })) as unknown as PostModel; // Type assertion
    isEdited = true;
    message = `Updated post with id: ${post.id} successfully.`;
  }

  return { isEdited, updatedPost, message };
}

// export async function UpdatePostById(
//   postId: number,
//   userId: number | undefined,
//   title: string,
//   content: string
// ) {
//   let isEdited: boolean = false;
//   let message: string =
//     "Failed to edit the post. Post does not exist or unauthorized access.";

//   const post = await prisma.post.findFirst({ where: { id: postId } });
//   if (post && post.authorId === userId) {
//     const updatedPost = await prisma.post.update({
//       where: { id: postId },
//       data: {
//         title,
//         content,
//       },
//     });

//     isEdited = true;
//     message = isEdited
//       ? `Edited post with id: ${post.id} successfully.`
//       : "Failed to edit the post.";

//     return { isEdited, updatedPost, message };
//     // return updatedPost;
//   }
// }

export async function deletePostById(postId: number, userId: number) {
  let isDeleted: boolean = false;
  let message: string =
    "Failed to delete the post. Post does not exist or unauthorized access.";

  const post = await prisma.post.findFirst({ where: { id: postId } });
  if (post && post.authorId === userId) {
    const deletedPost = await prisma.post.delete({
      where: { id: postId, authorId: userId },
    });
    isDeleted = true;
    message = deletedPost
      ? `Deleted post with id: ${post.id} successfully.`
      : "Failed to delete the post.";
  }

  return { isDeleted, message };
}

export async function checkReport(postId: number, userId: number) {
  const report = await prisma.report.findFirst({
    where: {
      postId,
      reportedById: userId,
    },
  });

  return report !== null;
}

export async function reportPost(postId: number, reportedById: number) {
  try {
    // Check if the report already exists
    const existingReport = await prisma.report.findUnique({
      where: {
        postId_reportedById: {
          postId,
          reportedById,
        },
      },
    });

    if (existingReport) {
      return existingReport;
    }

    // Create a new report
    const report = await prisma.report.create({
      data: {
        postId,
        reportedById,
      },
    });

    return report;
  } catch (error) {
    console.error("Error reporting post:", error);
    return null;
  }
}

export async function getAllReports() {
  try {
    const reports = await prisma.report.findMany({
      // include: {
      //   post: true,
      //   reportedBy: true,
      // },
      include: {
        post: {
          include: {
            author: true, // Include the author relation
          },
        },
        reportedBy: true,
      },
      orderBy: {
        createdAt: "desc", // Sort by createdAt in descending order
      },
    });
    console.log("Fetched Reports:", reports); // Log the fetched reports to inspect the structure
    return reports;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw new Error("Failed to fetch reports");
  }
}

export async function deletePostByReportId(reportId: number) {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    throw new Error("Report not found");
  }

  const { postId } = report;

  await prisma.post.delete({
    where: { id: postId },
  });
}

export async function getComment(postId: number) {
  let message: string = "Failed to fetch comments";
  const comments = await prisma.comment.findMany({
    where: { postId: postId },
    include: {
      user: true,
    },
  });
  return { comments, message };
}
