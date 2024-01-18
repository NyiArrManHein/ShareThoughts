import Post from "./components/Post";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex flex-row w-full p-5">
        <div className=" w-1/4 hidden sm:flex">Page Links</div>
        <div className="w-full px-3">
          <Post />
          <Post />
          <Post />
          <Post />
        </div>
        <div className=" w-1/4 hidden sm:flex">Sidebar</div>
      </div>
    </main>
  );
}
