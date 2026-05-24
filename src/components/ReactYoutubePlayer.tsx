// Dependencies
import React, { useState, useRef } from "react";
import ReactPlayer from "react-player/youtube";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPause,
  faPlay,
  faExpand,
  faForward,
  faBackward,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

import { Slider } from "@material-tailwind/react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Duration from "./Duration";

const ReactYoutubePlayer = ({ videoUrl }: { videoUrl: string }) => {
  const [playing, setPlaying] = useState<any>(true);
  const [seek, setSeek] = useState<any>({ played: 0 });
  const [isFullScreen, setIsFullScreen] = useState<any>(false);
  const handleFullScreen = useFullScreenHandle();
  const [duration, setDuration] = useState(0);
  const [showPlaybackSpeed, setShowPlaybackSpeed] = useState(false);

  const [playbackRate, setPlaybackRate] = useState(1);

  const player = useRef<any>();
  return (
    <FullScreen handle={handleFullScreen}>
      <div className=" relative">
        <div className="relative">
          <div
            className="absolute top-0 left-0 w-full h-full bg-black opacity-0"
            onClick={() => setPlaying(!playing)}
          ></div>
          <ReactPlayer
            url={videoUrl + "&rel=0"}
            playing={playing}
            onProgress={(e) => {
              setSeek(e);
            }}
            loop={false}
            playbackRate={playbackRate}
            height={`${handleFullScreen.active ? "94vh" : "50vh"}`}
       
            width="100%"
            ref={player}
            onEnded={() => {
              player.current.seekTo(0);
              setSeek({
                played: 0,
              });
            }}
            onDuration={(totalDuration) => {
              setDuration(totalDuration);
            }}

            //   className="h-[100vh]"
            //   className="react-player"
          />
        </div>
        <div className="bg-gray-900 rounded-b-lg text-white p-4 pt-0  ">
          <div className="w-full   md:hidden ">
            <div className="flex items-center gap-2 mb-1 pt-2">
              <Duration className={""} seconds={duration * seek.played} /> /{" "}
              <Duration className={""} seconds={duration} />
            </div>

            <Slider
              barClassName=" bg-[#B153E0]"
              className="text-[#B153E0] "
              defaultValue={0}
              value={seek.played * 100}
              onMouseDown={() => {}}
              onMouseUp={(e: any) => {
                // player.seekTo(parseFloat(e.target.value));
              }}
              onChange={(e: any) => {
                player.current.seekTo(parseFloat(e.target.value) / 100);
                setSeek({
                  played: e.target.value / 100,
                });
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={() => setPlaying(!playing)} className="mt-6">
                <FontAwesomeIcon
                  icon={playing ? faPause : faPlay}
                  className="text-2xl  "
                />
              </button>
              <div className="flex gap-4 ml-6 items-center">
                <button
                  onClick={() => {
                    player.current.seekTo(
                      (duration * seek.played - 10) / duration,
                    );
                    setSeek({
                      played: (duration * seek.played - 10) / duration,
                    });
                  }}
                  className="mt-6"
                >
                  <FontAwesomeIcon icon={faBackward} className="text-2xl  " />
                </button>
                <button
                  onClick={() => {
                    player.current.seekTo(
                      (duration * seek.played + 10) / duration,
                    );
                    setSeek({
                      played: (duration * seek.played + 10) / duration,
                    });
                  }}
                  className="mt-6"
                >
                  <FontAwesomeIcon icon={faForward} className="text-2xl  " />
                </button>
              </div>
            </div>

            <div className="w-full mx-6 hidden md:block">
              <div className="flex items-center mr-4 gap-2 mb-1">
                <Duration className={""} seconds={duration * seek.played} /> /{" "}
                <Duration className={""} seconds={duration} />
              </div>
              {/* <input
            className=" w-full "
            type="range"
            value={seek.played * 100}
            onMouseDown={() => {}}
            onMouseUp={(e: any) => {
              player.current.seekTo(parseFloat(e.target.value) / 100);
              // player.seekTo(parseFloat(e.target.value));
            }}
            onChange={(e: any) => {
              setSeek({
                played: e.target.value / 100,
              });
            }}
          /> */}
              <Slider
                barClassName=" bg-[#B153E0]"
                className="text-[#B153E0]"
                defaultValue={0}
                value={seek.played * 100}
                onMouseDown={() => {}}
                onChange={(e: any) => {
                  player.current.seekTo(parseFloat(e.target.value) / 100);
                  setSeek({
                    played: e.target.value / 100,
                  });
                }}
              />
            </div>

            <div className="flex">
              <button
                onClick={() => {
                  setShowPlaybackSpeed((prev) => !prev);
                }}
                className="mt-6 mr-6"
              >
                <FontAwesomeIcon
                  icon={faGear}
                  className={`text-2xl  ${showPlaybackSpeed && "-rotate-90"} duration-150 ease-in-out`}
                />
              </button>

              <div
                className={`${!showPlaybackSpeed && "hidden"} absolute right-6 bottom-20 bg-gray-900 py-4 rounded-lg`}
              >
                <p
                  className={`${playbackRate == 1 && "bg-gray-800"} py-2 px-8 hover:bg-gray-700 cursor-pointer`}
                  onClick={() => {
                    setPlaybackRate(1);
                    setShowPlaybackSpeed(false);
                  }}
                >
                  1x
                </p>
                <p
                  className={`${playbackRate == 1.25 && "bg-gray-800"} py-2 px-8 hover:bg-gray-700 cursor-pointer`}
                  onClick={() => {
                    setPlaybackRate(1.25);
                    setShowPlaybackSpeed(false);
                  }}
                >
                  1.25x
                </p>
                <p
                  className={`${playbackRate == 1.5 && "bg-gray-800"} py-2 px-8 hover:bg-gray-700 cursor-pointer`}
                  onClick={() => {
                    setPlaybackRate(1.5);
                    setShowPlaybackSpeed(false);
                  }}
                >
                  1.5x
                </p>
                <p
                  className={`${playbackRate == 2 && "bg-gray-800"} py-2 px-8 hover:bg-gray-700 cursor-pointer`}
                  onClick={() => {
                    setPlaybackRate(2);
                    setShowPlaybackSpeed(false);
                  }}
                >
                  2x
                </p>
              </div>

              <button
                className="mt-6"
                onClick={() => {
                  if (handleFullScreen.active) {
                    handleFullScreen.exit();
                  } else {
                    handleFullScreen.enter();
                  }
                }}
              >
                <FontAwesomeIcon icon={faExpand} className="text-2xl  " />
              </button>
            </div>
          </div>
        </div>
      </div>
    </FullScreen>
  );
};

export default ReactYoutubePlayer;
