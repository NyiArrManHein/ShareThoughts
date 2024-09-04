import { PostModel, ReactionCounts } from "@/lib/models";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Reactions } from "@prisma/client";
import { FaHeart, FaLaugh, FaSadCry, FaThumbsUp } from "react-icons/fa";
import Image from "next/image";
import profilePic from "../img/profile.webp";
import { useRouter } from "next/navigation";

const MyTabs = ({ currentPost }: { currentPost: PostModel }) => {
  const reactionCounts = currentPost.likes.reduce<Partial<ReactionCounts>>(
    (acc, like) => {
      const reaction = like.reaction as keyof ReactionCounts;
      acc[reaction] = (acc[reaction] || 0) + 1;
      return acc;
    },
    {}
  );

  const router = useRouter();

  const profileViewAction = (id: number) => {
    router.push(`/profileView/${id}`);
  };

  return (
    <div className="w-full max-w-md px-2 sm:px-0">
      <TabGroup>
        <TabList className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          <Tab className="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 data-[selected]:bg-blue-500 data-[selected]:text-white">
            All
          </Tab>
          <Tab className="w-full flex justify-center items-center rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 data-[selected]:bg-blue-500 data-[selected]:text-white">
            <div className="text-2xl mr-2">
              <FaThumbsUp />
            </div>
            <div>{reactionCounts.LIKE || 0}</div>
          </Tab>
          <Tab className="w-full flex justify-center items-center rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 data-[selected]:bg-blue-500 data-[selected]:text-white">
            <div className="text-2xl mr-2">
              <FaHeart />
            </div>
            <div>{reactionCounts.LOVE || 0}</div>
          </Tab>
          <Tab className="w-full flex justify-center items-center rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 data-[selected]:bg-blue-500 data-[selected]:text-white">
            <div className="text-2xl mr-2">
              <FaLaugh />
            </div>
            <div>{reactionCounts.HAHA || 0}</div>
          </Tab>
          <Tab className="w-full flex justify-center items-center rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 data-[selected]:bg-blue-500 data-[selected]:text-white">
            <div className="text-2xl mr-2">
              <FaSadCry />
            </div>
            <div>{reactionCounts.SAD || 0}</div>
          </Tab>
        </TabList>
        <TabPanels className="mt-2">
          <TabPanel>
            {currentPost.likes.map((like, index) => (
              <div
                className="flex flex-row items-center cursor-pointer"
                key={index}
                onClick={() => profileViewAction(like.user.id)}
              >
                <div role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-8 rounded-full">
                    <Image
                      src={profilePic}
                      alt="Profile Picture"
                      width={50}
                      height={50}
                    />
                  </div>
                </div>
                <div key={like.id}>{like.user.username}</div>
              </div>
            ))}
          </TabPanel>
          <TabPanel>
            {currentPost.likes
              .filter((like) => like.reaction === Reactions.LIKE)
              .map((like, index) => (
                <div
                  className="flex flex-row items-center cursor-pointer"
                  key={index}
                  onClick={() => profileViewAction(like.user.id)}
                >
                  <div
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-8 rounded-full">
                      <Image
                        src={profilePic}
                        alt="Profile Picture"
                        width={50}
                        height={50}
                      />
                    </div>
                  </div>
                  <div key={like.id}>{like.user.username}</div>
                </div>
              ))}
          </TabPanel>
          <TabPanel>
            {currentPost.likes
              .filter((like) => like.reaction === Reactions.LOVE)
              .map((like, index) => (
                <div
                  className="flex flex-row items-center cursor-pointer"
                  key={index}
                  onClick={() => profileViewAction(like.user.id)}
                >
                  <div
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-8 rounded-full">
                      <Image
                        src={profilePic}
                        alt="Profile Picture"
                        width={50}
                        height={50}
                      />
                    </div>
                  </div>
                  <div key={like.id}>{like.user.username}</div>
                </div>
              ))}
          </TabPanel>
          <TabPanel>
            {currentPost.likes
              .filter((like) => like.reaction === Reactions.HAHA)
              .map((like, index) => (
                <div
                  className="flex flex-row items-center cursor-pointer"
                  key={index}
                  onClick={() => profileViewAction(like.user.id)}
                >
                  <div
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-8 rounded-full">
                      <Image
                        src={profilePic}
                        alt="Profile Picture"
                        width={50}
                        height={50}
                      />
                    </div>
                  </div>
                  <div key={like.id}>{like.user.username}</div>
                </div>
              ))}
          </TabPanel>
          <TabPanel>
            {currentPost.likes
              .filter((like) => like.reaction === Reactions.SAD)
              .map((like, index) => (
                <div
                  className="flex flex-row items-center cursor-pointer"
                  key={index}
                  onClick={() => profileViewAction(like.user.id)}
                >
                  <div
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-8 rounded-full">
                      <Image
                        src={profilePic}
                        alt="Profile Picture"
                        width={50}
                        height={50}
                      />
                    </div>
                  </div>
                  <div key={like.id}>{like.user.username}</div>
                </div>
              ))}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};
export default MyTabs;
