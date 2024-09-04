"use client";
import { useSearchParams } from "next/navigation";
import Html from "../components/Html";

const NotificationView = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const content = searchParams.get("content");

  if (!title || !content) {
    return <p>Loading...</p>;
  }

  return (
    <Html showNavbar={true}>
      <div className="flex flex-row w-full p-5 h-screen">
        <div className="w-1/4 lg:w-6/12 hidden sm:flex"></div>
        <div className="w-full px-3">
          <div className="card card-bordered border-base-300 flex flex-col text-justify p-3 mb-1 sm:text-sm text-base min-h-64">
            <div className="card-title">Reported Post Preview</div>
            <div className=" card-body text-lg sm:text-2xl pb-0">{title}</div>
            <div className=" card-body text-lg whitespace-pre-line overflow-auto">
              {content}
            </div>
          </div>
        </div>
        <div className="w-1/4 lg:w-6/12 hidden sm:flex"></div>
      </div>
    </Html>
  );
};

export default NotificationView;
