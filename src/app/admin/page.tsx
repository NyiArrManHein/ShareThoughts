"use client";
import { PostModel, ReportModel } from "@/lib/models";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { toast } from "sonner";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { count } from "console";
import Html from "../components/Html";

export default function Admin() {
  const [reports, setReports] = useState<ReportModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostModel | null>(null);

  const fetchReports = async () => {
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
  };

  useEffect(() => {
    // async function fetchReports() {
    //   try {
    //     const response = await fetch("/api/posts/report/admin/", {
    //       method: "GET",
    //       headers: { "Content-Type": "application/json" },
    //     });
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch reports");
    //     }
    //     const fetchedReports = await response.json();
    //     setReports(fetchedReports.reports);
    //   } catch (error) {
    //     console.error("Error fetching reports:", error);
    //   }
    // }
    fetchReports();

    // const intervalId = setInterval(fetchReports, 5000);

    // return () => {
    //   clearInterval(intervalId);
    // };
  }, []);

  const handleViewPost = (post: PostModel) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, reportId: number) => {
    e.stopPropagation();
    // const confirmed = window.confirm(
    //   "Are you sure you want to delete this post?"
    // );
    // if (!confirmed) return;

    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete post of this report?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const res = await fetch("/api/posts/report/admin/", {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ reportId }),
              });

              if (res.ok) {
                setReports((prevReports) =>
                  prevReports.filter((report) => report.post.id !== reportId)
                );
                toast("Post deleted successfully");
              } else {
                const { error } = await res.json();
                console.error("Error deleting post:", error);
                toast("Failed to delete post");
              }
            } catch (error) {
              console.error("Error deleting post:", error);
              toast("Failed to delete post");
            }

            fetchReports();
          },
        },
        {
          label: "No",
          onClick: () => {
            // Do nothing
          },
        },
      ],
    });
  };

  const handleCancel = async (e: React.MouseEvent, reportId: number) => {
    e.stopPropagation();
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to cancel this report?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            const res = await fetch("/api/posts/report/admin/cancel/", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ reportId }),
            });

            if (res.ok) {
              toast("Report removed successfully");
            } else {
              const { error } = await res.json();
              console.error("Error removing report:", error);
              toast("Failed to remove report");
            }
            fetchReports();
          },
        },
        {
          label: "No",
          onClick: () => {
            // Do nothing
          },
        },
      ],
    });
  };

  return (
    <Html showNavbar={true}>
      <div className="mt-7 min-h-screen overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">No</th>
              <th className="py-3 px-6 text-left">Reported By</th>
              <th className="py-3 px-6 text-left">Author</th>
              <th className="py-3 px-6 text-left">Reason</th>
              <th className="py-3 px-6 text-left">Reported Count</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {reports.map(
              (report, index) =>
                report.post.isDeleted !== true && (
                  <tr
                    key={report.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                    onClick={() => handleViewPost(report.post)}
                  >
                    <td className="py-3 px-6 text-left">{index + 1}</td>
                    <td className="py-3 px-6 text-left">
                      {report.reportedBy.username}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {report.post.author.username}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {report.reportReason}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {report.reportCount}
                    </td>
                    <td className="py-3 px-6 text-left">
                      <div className="flex space-x-4">
                        <button
                          onClick={(e) => handleDelete(e, report.id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                        >
                          Delete
                        </button>
                        <button
                          onClick={(e) => handleCancel(e, report.id)}
                          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )
            )}
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
    </Html>
  );
}
