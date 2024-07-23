"use client";
import { PostModel, ReportModel } from "@/lib/models";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";

export default function Admin() {
  const [reports, setReports] = useState<ReportModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostModel | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch("/api/posts/report/admin/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }
        const fetchedReports = await response.json();
        setReports(fetchedReports.reports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    }
    fetchReports();
    // Set up polling
    const intervalId = setInterval(fetchReports, 5000); // Fetch reports every 5 seconds
    console.log("Component mounted, interval set");

    return () => {
      clearInterval(intervalId);
      console.log("Component unmounted, interval cleared");
    }; // Clear the interval on component unmount
  }, []);

  // Log the state after it has been updated
  useEffect(() => {
    console.log("Updated Reports State:", reports);
  }, [reports]);

  const handleViewPost = (post: PostModel) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, reportId: number) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch("/api/posts/report/admin/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reportId }),
      });

      if (res.ok) {
        setReports((prevReports) =>
          prevReports.filter((report) => report.post.id !== reportId)
        );
        alert("Post deleted successfully");
      } else {
        const { error } = await res.json();
        console.error("Error deleting post:", error);
        alert("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  return (
    <div className="mt-7 overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">No</th>
            <th className="py-3 px-6 text-left">ReportedBy</th>
            <th className="py-3 px-6 text-left">Author</th>
            <th className="py-3 px-6 text-left">Title</th>
            <th className="py-3 px-6 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {reports.map((report, index) => (
            <tr
              key={report.id}
              className="border-b border-gray-200 hover:bg-gray-100"
              onClick={() => handleViewPost(report.post)}
            >
              <td className="py-3 px-6 text-left">{index + 1}</td>
              <td className="py-3 px-6 text-left">
                {report.reportedBy?.lastName || "Unknown"}
              </td>
              <td className="py-3 px-6 text-left">
                {report.post?.author?.lastName || "Unknown"}
              </td>
              <td className="py-3 px-6 text-left">
                {report.post?.title || "Unknown"}
              </td>
              <td className="py-3 px-6 text-left">
                <button
                  onClick={(e) => handleDelete(e, report.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedPost && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div>
            <h2 className="text-2xl font-bold mb-2">{selectedPost.title}</h2>
            <p className="mb-4">{selectedPost.content}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}