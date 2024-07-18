import prisma from "@/db";
import { AccountType, PostModel, PostType } from "@/lib/models";

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

export async function insertPostByUsername(
  authorId: number,
  postType: PostType,
  title: string,
  content: string
) {
  const insertedPost = await prisma.post.create({
    data: {
      title: title,
      content: content,
      authorId: authorId,
    },
    include: {
      author: true,
      likes: true,
      comments: true,
      shares: true,
    },
  });
  return insertedPost;
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
): Promise<UpdatePostResponse> {
  let isEdited = false;
  let message =
    "Failed to update the post. Post does not exist or unauthorized access.";
  let updatedPost: PostModel | undefined = undefined;

  const post = await prisma.post.findFirst({
    where: { id: postId, authorId: userId },
  });
  if (post) {
    updatedPost = (await prisma.post.update({
      where: { id: postId },
      data: { title: postTitle, content: postContent },
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
