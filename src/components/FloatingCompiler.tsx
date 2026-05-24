import React, { useContext, useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UserContext } from "@/Contexts/UserContext";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";

type Props = {};

export default function FloatingCompiler({}: Props) {
  const [user, setUser] = useContext<any>(UserContext);
  const [language, setLanguage] = useState("cpp");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for token only on client-side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, []);

  const [code, setCode] = useState<any>({
    java: `public class Main {
    public static void main(String[] args) {
        // Your code here
        System.out.println("Hello, World!");
    }
}`,
    python: `# Your Python code here
def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    // Your code here
    cout << "Hello, World!" << endl;
    return 0;
}`,
  });
  const languageIds: any = {
    cpp: 76,
    python: 71,
    java: 91,
  };

  const submitCompiler = () => {
    setButtonLoading(true);

    if (!isLoggedIn) {
      setOutput("Please login to run the code");
      setButtonLoading(false);
      return;
    }

    // Safe access to localStorage
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setOutput("Please login to run the code");
      setButtonLoading(false);
      return;
    }

    axios
      .post(
        BACKEND_URL + "/user/module/quick-compile",
        {
          languageId: languageIds[language],
          input: input,
          code: code[language],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        if (res.data.data.status.description === "Accepted") {
          setOutput(
            res.data.data.stdout
              .split("\n")
              .map((str: any) => (
                <p key={Math.random()}>
                  {str.length !== 0 ? str : <>&nbsp;</>}
                </p>
              )),
          );
        } else if (res.data.data.status.description === "Compilation Error") {
          setOutput("Compilation Error!");
        } else {
          setOutput("Runtime Error!");
        }
        setButtonLoading(false);
      })
      .catch((err) => {
        setButtonLoading(false);
      });
  };

  return (
    <Dialog
      open={user.openCompiler}
      onOpenChange={(open) => setUser({ ...user, openCompiler: open })}
    >
      <DialogContent
        showCloseButton={false}
        className="w-[90vw] max-w-[1440px] text-darkHeading rounded-2xl bg-[#0B060D]/60 dark:bg-[#0B060D]/30 backdrop-blur-lg border border-border/20 p-4 md:p-6"
      >
        <div className="text-lg font-medium leading-6">
          <div className="flex justify-between items-center">
            <span className="text-lg md:text-xl font-semibold text-white tracking-wide">
              Quick Compiler
            </span>
            <button
              onClick={() => setUser({ ...user, openCompiler: false })}
              className="p-1 rounded-full hover:bg-muted/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
                  <div className=" flex flex-col-reverse md:flex-row justify-between gap-8">
                    <div className="pt-4 bg-[#1e1e1e]  " style={{ flex: 3 }}>
                      <Editor
                        language={language}
                        value={code[language]}
                        onChange={(e) => setCode({ ...code, [language]: e })}
                        theme="vs-dark"
                        defaultValue=""
                        className="h-[30vh] md:h-[50vh]"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <select
                        className="select select-bordered w-full max-w-xs bg-gray-100/10 text-sm md:text-base"
                        onChange={(e) => {
                          setLanguage(e.target.value);
                        }}
                        value={language}
                      >
                        <option className="bg-[#0B060D]" value="cpp">
                          C++
                        </option>

                        <option className="bg-[#0B060D]" value="python">
                          Python
                        </option>
                        <option className="bg-[#0B060D]" value="java">
                          Java
                        </option>
                      </select>
                      <p className="mt-4 text-sm md:text-base">Input</p>
                      <textarea
                        className="w-full mt-2 px-3 py-2 md:py-3 rounded mb-2 resize-none bg-gray-200/20 outline-none focus:ring ring-gray-300/80 text-white text-sm md:text-base"
                        placeholder="Input"
                        value={input}
                        onChange={(e) => {
                          setInput(e.target.value);
                        }}
                      />

                      <div>
                        <p className="text-sm md:text-base">Output</p>
                        <div className="w-full h-[80px] overflow-y-scroll md:h-[160px] mt-2 px-3 py-2 md:py-3 rounded mb-2 bg-gray-200/20 text-white text-sm md:text-base">
                          {output}
                        </div>
                      </div>
                      <div className="flex justify-end mt-2 md:mt-3">
                        <button
                          onClick={submitCompiler}
                          className={`py-1.5 md:py-2 flex gap-2 items-center px-4 md:px-6 ${
                            buttonLoading
                              ? "bg-gray-500 cursor-not-allowed"
                              : "bg-green-700 cursor-pointer hover:opacity-75 ease-in-out duration-150 focus:ring ring-gray-300/80"
                          } rounded font-semibold text-white text-base md:text-lg`}
                          disabled={buttonLoading}
                        >
                          {buttonLoading ? (
                            <svg
                              className="animate-spin size-5 shrink-0"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                              />
                            </svg>
                          ) : (
                            <svg
                              width={16}
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                              <g
                                id="SVGRepo_tracerCarrier"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></g>
                              <g id="SVGRepo_iconCarrier">
                                {" "}
                                <path
                                  d="M21.4086 9.35258C23.5305 10.5065 23.5305 13.4935 21.4086 14.6474L8.59662 21.6145C6.53435 22.736 4 21.2763 4 18.9671L4 5.0329C4 2.72368 6.53435 1.26402 8.59661 2.38548L21.4086 9.35258Z"
                                  fill="#fff"
                                ></path>{" "}
                              </g>
                            </svg>
                          )}{" "}
                          Run
                        </button>
                      </div>
                      {/* Safe check for login status */}
                      {!isLoggedIn && (
                        <div className="mt-2 text-yellow-400 text-sm text-center">
                          Please login to run the code
                        </div>
                      )}
                    </div>
                  </div>
      </DialogContent>
    </Dialog>
  );
}
