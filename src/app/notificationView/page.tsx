"use client";
import { useSearchParams } from "next/navigation";
import Html from "../components/Html";
import { Suspense } from "react";
import NotificationContent from "../components/NotificationContent";

const NotificationView = () => {
  // const searchParams = useSearchParams();
  // const title = searchParams.get("title");
  // const content = searchParams.get("content");

  // if (!title || !content) {
  //   return <p>Loading...</p>;
  // }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <NotificationContent />
    </Suspense>
  );
};

export default NotificationView;
