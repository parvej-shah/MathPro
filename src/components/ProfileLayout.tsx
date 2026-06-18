import React, { useEffect, useState } from "react";

type Props = { children: React.ReactNode };

import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import { HindSiliguri, logout } from "@/helpers";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { usePathname } from "next/navigation";

export default function ProfileLayout({ children }: Props) {
  const pathname = usePathname();
  return (
    <ProtectedRoute>
      <div
        className={`  ${HindSiliguri.variable} overflow-x-hidden   font-hind`}
      >
        <Toaster />
        <div className="overflow-x-hidden bg-white py-16 dark:bg-[#000000]">
          <div className="z-20 mx-auto min-h-[80vh] w-[90%] py-12 lgXl:w-[90%]">
            <div className="flex flex-col items-start lg:flex-row  justify-between gap-20 w-full">
              <div className="rounded-xl flex-[1]  py-16 px-8  bg-muted/40 backdrop-blur-lg w-full">
                <div className="flex flex-col items-center">
                  <img
                    src="/profile_image.png"
                    alt=""
                    className="w-[100px] h-[100px] object-cover rounded-full"
                  />
                  <div className="mt-8 mb-12 flex flex-col items-center w-full">
                    <div className="bg-[#DFDBDB]/10 w-full h-4 rounded-full">
                      <div className="bg-[#2BA98B] w-[15%] h-4 rounded-full"></div>
                    </div>
                    <p className="mt-3 text-paragraph dark:text-darkParagraph">
                      45% Completed
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <Link
                    href="/profile/my-courses"
                    className={
                      pathname && pathname && pathname.includes("my-courses")
                        ? "flex items-center gap-4 px-4 py-3 border rounded-xl border-[#2BA98B]/20  backdrop-blur-lg bg-[#2BA98B]/5 "
                        : "flex items-center gap-4 px-4 py-3 rounded-xl hover:border-[#2BA98B]/20 cursor-pointer duration-200  ease-in-out    hover:bg-[#6bbba81a]"
                    }
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14 22.1671C12.4038 21.2456 10.5931 20.7604 8.75 20.7604C6.90686 20.7604 5.0962 21.2456 3.5 22.1671V7.00048C5.0962 6.07892 6.90686 5.59375 8.75 5.59375C10.5931 5.59375 12.4038 6.07892 14 7.00048M14 22.1671C15.5962 21.2456 17.4069 20.7604 19.25 20.7604C21.0931 20.7604 22.9038 21.2456 24.5 22.1671V7.00048C22.9038 6.07892 21.0931 5.59375 19.25 5.59375C17.4069 5.59375 15.5962 6.07892 14 7.00048M14 22.1671V7.00048"
                        className="stroke-black dark:stroke-white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>

                    <p
                      className={
                        pathname && pathname && pathname.includes("my-courses")
                          ? "text-heading dark:text-darkHeading font-semibold text-xl"
                          : "text-paragraph dark:text-darkParagraph text-xl "
                      }
                    >
                      My Courses
                    </p>
                  </Link>
                  <Link
                    href="/profile/live-classes"
                    className={
                      pathname && pathname && pathname.includes("live-classes")
                        ? "flex items-center gap-4 px-4 py-3 border rounded-xl border-[#2BA98B]/20  backdrop-blur-lg bg-[#2BA98B]/5 "
                        : "flex items-center gap-4 px-4 py-3 rounded-xl hover:border-[#2BA98B]/20 cursor-pointer duration-200  ease-in-out    hover:bg-[#6bbba81a]"
                    }
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M0 0H24.1092V3.88858H22.5537V1.55543H1.55543V19.4429H18.1884V20.9983H0V0ZM23.3315 10.1103C23.9502 10.1103 24.5437 9.86449 24.9812 9.42694C25.4188 8.98939 25.6646 8.39594 25.6646 7.77715C25.6646 7.15836 25.4188 6.56492 24.9812 6.12737C24.5437 5.68982 23.9502 5.44401 23.3315 5.44401C22.7127 5.44401 22.1192 5.68982 21.6817 6.12737C21.2441 6.56492 20.9983 7.15836 20.9983 7.77715C20.9983 8.39594 21.2441 8.98939 21.6817 9.42694C22.1192 9.86449 22.7127 10.1103 23.3315 10.1103ZM24.911 11.6735C25.9212 11.6735 26.7207 12.1277 27.2441 12.8292C27.7333 13.4864 27.9402 14.2991 27.9869 15.0496C28.0326 15.8194 27.9277 16.5908 27.6781 17.3205C27.4448 17.9971 27.0505 18.6971 26.4423 19.1769V26.8312C26.4429 27.1243 26.3331 27.4069 26.1348 27.6227C25.9365 27.8385 25.6642 27.9718 25.3721 27.996C25.08 28.0202 24.7895 27.9336 24.5584 27.7533C24.3272 27.5731 24.1724 27.3125 24.1247 27.0233L23.1215 20.9983H22.8897L21.7558 27.0458C21.702 27.3312 21.5436 27.5863 21.3116 27.7611C21.0797 27.936 20.7909 28.018 20.5017 27.9912C20.2124 27.9643 19.9436 27.8305 19.7478 27.616C19.552 27.4015 19.4433 27.1216 19.4429 26.8312V15.7355C19.2874 15.9724 19.1339 16.2107 18.9825 16.4502L18.9218 16.5459L18.9063 16.5708L18.9024 16.5778C18.7976 16.7461 18.6516 16.8849 18.4782 16.9811C18.3048 17.0773 18.1098 17.1277 17.9116 17.1276H14.023C13.7136 17.1276 13.4169 17.0047 13.1981 16.7859C12.9793 16.5672 12.8564 16.2704 12.8564 15.9611C12.8564 15.6517 12.9793 15.3549 13.1981 15.1362C13.4169 14.9174 13.7136 14.7945 14.023 14.7945H17.2715C17.4605 14.5021 17.7094 14.1225 17.9707 13.7415C18.2429 13.344 18.5431 12.9233 18.8106 12.5935C18.9405 12.4326 19.0859 12.2646 19.2321 12.1269C19.3037 12.0593 19.4032 11.9714 19.5245 11.8936C19.7387 11.7531 19.9886 11.6769 20.2447 11.6743L24.911 11.6735Z"
                        className="fill-black dark:fill-white"
                      />
                    </svg>

                    <p
                      className={
                        pathname && pathname && pathname.includes("live-classes")
                          ? "text-heading dark:text-darkHeading font-semibold text-xl"
                          : "text-paragraph dark:text-darkParagraph text-xl "
                      }
                    >
                      Live Class
                    </p>
                  </Link>
                  <Link
                    href="/profile/my-points"
                    className={
                      pathname && pathname && pathname.includes("my-points")
                        ? "flex items-center gap-4 px-4 py-3 border rounded-xl border-[#2BA98B]/20  backdrop-blur-lg bg-[#2BA98B]/5 "
                        : "flex items-center gap-4 px-4 py-3 rounded-xl hover:border-[#2BA98B]/20 cursor-pointer duration-200  ease-in-out    hover:bg-[#6bbba81a]"
                    }
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.0606 18.7011C10.3353 18.8955 10.6636 19.0001 11.0002 19.0003C11.3164 19.0002 11.6258 18.9079 11.8904 18.7348C12.155 18.5616 12.3634 18.3151 12.4902 18.0253L13.2592 15.6853C13.4468 15.1224 13.7629 14.6108 14.1824 14.1912C14.6019 13.7715 15.1133 13.4552 15.6762 13.2673L17.9142 12.5403C18.2319 12.429 18.5068 12.2209 18.7002 11.9453C18.8489 11.7359 18.9457 11.4942 18.9826 11.24C19.0195 10.9859 18.9956 10.7266 18.9127 10.4836C18.8298 10.2405 18.6903 10.0206 18.5057 9.842C18.3212 9.66341 18.0968 9.53122 17.8512 9.45633L15.6362 8.73633C15.073 8.54959 14.5611 8.23421 14.141 7.81519C13.721 7.39617 13.4043 6.88503 13.2162 6.32233L12.4892 4.08533C12.3773 3.76844 12.1697 3.49414 11.8952 3.30033C11.6189 3.10983 11.2913 3.00781 10.9557 3.00781C10.6201 3.00781 10.2924 3.10983 10.0162 3.30033C9.73716 3.4974 9.52724 3.77729 9.41618 4.10033L8.67918 6.36533C8.49149 6.91331 8.18155 7.41139 7.77284 7.82184C7.36413 8.23228 6.86736 8.54433 6.32018 8.73433L4.08018 9.46133C3.76144 9.574 3.48574 9.78322 3.29145 10.0599C3.09716 10.3365 2.99393 10.6669 2.99613 11.0049C2.99833 11.343 3.10585 11.672 3.30372 11.9461C3.5016 12.2202 3.78 12.4258 4.10018 12.5343L6.31618 13.2533C6.8811 13.4423 7.39454 13.7596 7.81618 14.1803C7.92914 14.2934 8.0347 14.4137 8.13218 14.5403C8.39803 14.8828 8.60301 15.2684 8.73818 15.6803L9.46618 17.9143C9.57824 18.2317 9.78592 18.5066 10.0606 18.7011ZM6.78718 11.8283L4.56618 11.1073C4.56618 11.1073 4.48218 11.0703 4.48218 11.0003C4.48491 10.9755 4.49411 10.9518 4.50885 10.9316C4.52358 10.9115 4.54335 10.8955 4.56618 10.8853L6.80018 10.1603C7.57606 9.89083 8.27929 9.44596 8.85518 8.86033C9.42825 8.27316 9.86076 7.56371 10.1202 6.78533L10.8412 4.56633C10.8412 4.56633 10.8842 4.48233 10.9552 4.48233C11.0262 4.48233 11.0682 4.56633 11.0682 4.56633L11.7912 6.78933C12.0529 7.57538 12.4944 8.28951 13.0807 8.8749C13.667 9.46028 14.3817 9.90078 15.1682 10.1613L17.4372 10.8963C17.4588 10.9059 17.4775 10.921 17.4914 10.9402C17.5052 10.9593 17.5138 10.9818 17.5162 11.0053C17.5132 11.0298 17.504 11.0531 17.4895 11.0731C17.4749 11.093 17.4556 11.109 17.4332 11.1193L15.2082 11.8413C14.4219 12.1022 13.7075 12.5431 13.1217 13.1288C12.5359 13.7146 12.0951 14.4291 11.8342 15.2153L11.1192 17.4153C11.115 17.4424 11.1009 17.4668 11.0796 17.484C11.0584 17.5012 11.0315 17.5099 11.0042 17.5083C10.9002 17.5083 10.8862 17.4333 10.8862 17.4333L10.1632 15.2133C9.97404 14.6388 9.68828 14.1007 9.31818 13.6223C9.18215 13.4469 9.03554 13.2799 8.87918 13.1223C8.29141 12.5349 7.57527 12.0919 6.78718 11.8283ZM19.8043 24.7815C20.0078 24.9248 20.2509 25.0013 20.4999 25.0003C20.7473 25.0014 20.989 24.926 21.1919 24.7843C21.4002 24.6365 21.5563 24.4264 21.6379 24.1843L22.0099 23.0413C22.0885 22.804 22.2214 22.5883 22.3979 22.4113C22.5745 22.2342 22.7898 22.1007 23.0269 22.0213L24.1929 21.6433C24.4284 21.5597 24.6324 21.4053 24.7769 21.2013C24.9218 20.998 24.9997 20.7545 24.9997 20.5048C24.9997 20.2551 24.9218 20.0117 24.7769 19.8083C24.6232 19.5961 24.4056 19.4387 24.1559 19.3593L23.0119 18.9883C22.7746 18.9097 22.5588 18.7768 22.3818 18.6003C22.2047 18.4237 22.0712 18.2084 21.9919 17.9713L21.6129 16.8083C21.5311 16.5706 21.3768 16.3646 21.1717 16.2193C20.9666 16.074 20.721 15.9967 20.4696 15.9985C20.2182 16.0003 19.9738 16.0809 19.7707 16.2291C19.5676 16.3773 19.4162 16.5855 19.3379 16.8243L18.9639 17.9703C18.8873 18.2046 18.7579 18.4181 18.5858 18.5944C18.4136 18.7708 18.2032 18.9052 17.9709 18.9873L16.8049 19.3653C16.5693 19.449 16.3653 19.6034 16.2209 19.8073C16.0759 20.0107 15.998 20.2542 15.998 20.5038C15.998 20.7535 16.0759 20.997 16.2209 21.2003C16.3695 21.407 16.5794 21.5617 16.8209 21.6423L17.9649 22.0143C18.2032 22.0932 18.4196 22.2268 18.5969 22.4045C18.7743 22.5822 18.9075 22.7989 18.9859 23.0373L19.3639 24.2003C19.4468 24.4351 19.6008 24.6381 19.8043 24.7815ZM18.4329 20.5883L18.1639 20.5003L18.4459 20.4043C18.8999 20.2471 19.3114 19.9872 19.6484 19.6448C19.9855 19.3024 20.2388 18.8868 20.3889 18.4303L20.4769 18.1593L20.5659 18.4323C20.7185 18.8925 20.9764 19.3106 21.3191 19.6535C21.6618 19.9964 22.0798 20.2545 22.5399 20.4073L22.8329 20.5073L22.5619 20.5943C22.1019 20.748 21.6841 21.0066 21.3415 21.3498C20.9988 21.693 20.7408 22.1112 20.5879 22.5713L20.4999 22.8413L20.4119 22.5693C20.2595 22.1076 20.0012 21.6879 19.6575 21.3439C19.3139 20.9999 18.8945 20.7412 18.4329 20.5883Z"
                        className="fill-black dark:fill-white"
                      />
                    </svg>

                    <p
                      className={
                        pathname && pathname.includes("my-points")
                          ? "text-heading dark:text-darkHeading font-semibold text-xl"
                          : "text-paragraph dark:text-darkParagraph text-xl "
                      }
                    >
                      My points
                    </p>
                  </Link>

                  <Link
                    href="/profile/my-profile"
                    className={
                      pathname && pathname.includes("my-profile")
                        ? "flex items-center gap-4 px-4 py-3 border rounded-xl border-[#2BA98B]/20  backdrop-blur-lg bg-[#2BA98B]/5 "
                        : "flex items-center gap-4 px-4 py-3 rounded-xl hover:border-[#2BA98B]/20 cursor-pointer duration-200  ease-in-out    hover:bg-[#6bbba81a]"
                    }
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.196 19.9905C5.48476 19.0294 6.07563 18.187 6.88095 17.5883C7.68628 16.9896 8.66315 16.6664 9.66667 16.6667H14.3333C15.3381 16.6663 16.3162 16.9903 17.1221 17.5904C17.928 18.1905 18.5187 19.0347 18.8063 19.9975M1.5 12C1.5 13.3789 1.77159 14.7443 2.29926 16.0182C2.82694 17.2921 3.60036 18.4496 4.57538 19.4246C5.55039 20.3996 6.70791 21.1731 7.98182 21.7007C9.25574 22.2284 10.6211 22.5 12 22.5C13.3789 22.5 14.7443 22.2284 16.0182 21.7007C17.2921 21.1731 18.4496 20.3996 19.4246 19.4246C20.3996 18.4496 21.1731 17.2921 21.7007 16.0182C22.2284 14.7443 22.5 13.3789 22.5 12C22.5 10.6211 22.2284 9.25574 21.7007 7.98182C21.1731 6.70791 20.3996 5.55039 19.4246 4.57538C18.4496 3.60036 17.2921 2.82694 16.0182 2.29927C14.7443 1.77159 13.3789 1.5 12 1.5C10.6211 1.5 9.25574 1.77159 7.98182 2.29927C6.70791 2.82694 5.55039 3.60036 4.57538 4.57538C3.60036 5.55039 2.82694 6.70791 2.29926 7.98182C1.77159 9.25574 1.5 10.6211 1.5 12ZM8.5 9.66667C8.5 10.5949 8.86875 11.4852 9.52513 12.1415C10.1815 12.7979 11.0717 13.1667 12 13.1667C12.9283 13.1667 13.8185 12.7979 14.4749 12.1415C15.1313 11.4852 15.5 10.5949 15.5 9.66667C15.5 8.73841 15.1313 7.84817 14.4749 7.19179C13.8185 6.53542 12.9283 6.16667 12 6.16667C11.0717 6.16667 10.1815 6.53542 9.52513 7.19179C8.86875 7.84817 8.5 8.73841 8.5 9.66667Z"
                        className="stroke-black dark:stroke-white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <p
                      className={
                        pathname && pathname.includes("my-profile")
                          ? "text-heading dark:text-darkHeading font-semibold text-xl"
                          : "text-paragraph dark:text-darkParagraph text-xl "
                      }
                    >
                      My Profile
                    </p>
                  </Link>

                  <Link
                    href="/profile/social"
                    className={
                      pathname && pathname.includes("social")
                        ? "flex items-center gap-4 px-4 py-3 border rounded-xl border-[#2BA98B]/20  backdrop-blur-lg bg-[#2BA98B]/5 "
                        : "flex items-center gap-4 px-4 py-3 rounded-xl hover:border-[#2BA98B]/20 cursor-pointer duration-200  ease-in-out    hover:bg-[#6bbba81a]"
                    }
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.49949 14.4997L14.4995 7.4997M9.83282 3.99971L10.373 3.37437C11.4671 2.28042 12.951 1.66591 14.4982 1.66602C16.0453 1.66613 17.5291 2.28085 18.6231 3.37496C19.717 4.46906 20.3315 5.95293 20.3314 7.50012C20.3313 9.04731 19.7166 10.5311 18.6225 11.625L17.9995 12.1664M12.1662 17.9997L11.703 18.6227C10.5961 19.7173 9.10227 20.3311 7.5456 20.3311C5.98893 20.3311 4.49506 19.7173 3.38818 18.6227C2.8426 18.0832 2.40946 17.4409 2.11384 16.7329C1.81823 16.0248 1.66602 15.2652 1.66602 14.498C1.66602 13.7307 1.81823 12.9711 2.11384 12.263C2.40946 11.555 2.8426 10.9127 3.38818 10.3732L3.99951 9.83304"
                        className="stroke-black dark:stroke-white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>

                    <p
                      className={
                        pathname && pathname.includes("social")
                          ? "text-heading dark:text-darkHeading font-semibold text-xl"
                          : "text-paragraph dark:text-darkParagraph text-xl "
                      }
                    >
                      Social Links
                    </p>
                  </Link>
                  <Link
                    href="/profile/address"
                    className={
                      pathname && pathname.includes("address")
                        ? "flex items-center gap-4 px-4 py-3 border rounded-xl border-[#2BA98B]/20  backdrop-blur-lg bg-[#2BA98B]/5 "
                        : "flex items-center gap-4 px-4 py-3 rounded-xl hover:border-[#2BA98B]/20 cursor-pointer duration-200  ease-in-out    hover:bg-[#6bbba81a]"
                    }
                  >
                    <svg
                      width="25"
                      height="24"
                      viewBox="0 0 25 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 18.5837L8.5 16.8337M8.5 16.8337L1.5 20.3337V5.16699L8.5 1.66699M8.5 16.8337V1.66699M8.5 1.66699L15.5 5.16699M15.5 5.16699L22.5 1.66699V10.417M15.5 5.16699V11.5837M20.1667 18.0003V18.012M22.6412 20.4748C23.1308 19.9854 23.4642 19.3617 23.5993 18.6828C23.7345 18.0038 23.6652 17.3 23.4003 16.6604C23.1355 16.0208 22.6869 15.4741 22.1113 15.0895C21.5357 14.7049 20.8589 14.4996 20.1667 14.4996C19.4744 14.4996 18.7977 14.7049 18.2221 15.0895C17.6465 15.4741 17.1979 16.0208 16.933 16.6604C16.6681 17.3 16.5989 18.0038 16.734 18.6828C16.8691 19.3617 17.2026 19.9854 17.6922 20.4748C18.1798 20.9637 19.0047 21.694 20.1667 22.667C21.3928 21.6287 22.2188 20.8983 22.6412 20.4748Z"
                        className="stroke-black dark:stroke-white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>

                    <p
                      className={
                        pathname && pathname.includes("address")
                          ? "text-heading dark:text-darkHeading font-semibold text-xl"
                          : "text-paragraph dark:text-darkParagraph text-xl "
                      }
                    >
                      Gift Address
                    </p>
                  </Link>
                  <Link
                    href="/profile/educational-details"
                    className={
                      pathname && pathname.includes("educational-details")
                        ? "flex items-center gap-4 px-4 py-3 border rounded-xl border-[#2BA98B]/20  backdrop-blur-lg bg-[#2BA98B]/5 "
                        : "flex items-center gap-4 px-4 py-3 rounded-xl hover:border-[#2BA98B]/20 cursor-pointer duration-200  ease-in-out    hover:bg-[#6bbba81a]"
                    }
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.196 19.9905C5.48476 19.0294 6.07563 18.187 6.88095 17.5883C7.68628 16.9896 8.66315 16.6664 9.66667 16.6667H14.3333C15.3381 16.6663 16.3162 16.9903 17.1221 17.5904C17.928 18.1905 18.5187 19.0347 18.8063 19.9975M1.5 12C1.5 13.3789 1.77159 14.7443 2.29926 16.0182C2.82694 17.2921 3.60036 18.4496 4.57538 19.4246C5.55039 20.3996 6.70791 21.1731 7.98182 21.7007C9.25574 22.2284 10.6211 22.5 12 22.5C13.3789 22.5 14.7443 22.2284 16.0182 21.7007C17.2921 21.1731 18.4496 20.3996 19.4246 19.4246C20.3996 18.4496 21.1731 17.2921 21.7007 16.0182C22.2284 14.7443 22.5 13.3789 22.5 12C22.5 10.6211 22.2284 9.25574 21.7007 7.98182C21.1731 6.70791 20.3996 5.55039 19.4246 4.57538C18.4496 3.60036 17.2921 2.82694 16.0182 2.29927C14.7443 1.77159 13.3789 1.5 12 1.5C10.6211 1.5 9.25574 1.77159 7.98182 2.29927C6.70791 2.82694 5.55039 3.60036 4.57538 4.57538C3.60036 5.55039 2.82694 6.70791 2.29926 7.98182C1.77159 9.25574 1.5 10.6211 1.5 12ZM8.5 9.66667C8.5 10.5949 8.86875 11.4852 9.52513 12.1415C10.1815 12.7979 11.0717 13.1667 12 13.1667C12.9283 13.1667 13.8185 12.7979 14.4749 12.1415C15.1313 11.4852 15.5 10.5949 15.5 9.66667C15.5 8.73841 15.1313 7.84817 14.4749 7.19179C13.8185 6.53542 12.9283 6.16667 12 6.16667C11.0717 6.16667 10.1815 6.53542 9.52513 7.19179C8.86875 7.84817 8.5 8.73841 8.5 9.66667Z"
                        className="stroke-black dark:stroke-white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <p
                      className={
                        pathname && pathname.includes("educational-details")
                          ? "text-heading dark:text-darkHeading font-semibold text-xl"
                          : "text-paragraph dark:text-darkParagraph text-xl "
                      }
                    >
                      Education Details
                    </p>
                  </Link>
                  <Link
                    href="/profile/experience"
                    className={
                      pathname && pathname.includes("experience")
                        ? "flex items-center gap-4 px-4 py-3 border rounded-xl border-[#2BA98B]/20  backdrop-blur-lg bg-[#2BA98B]/5 "
                        : "flex items-center gap-4 px-4 py-3 rounded-xl hover:border-[#2BA98B]/20 cursor-pointer duration-200  ease-in-out    hover:bg-[#6bbba81a]"
                    }
                  >
                    <svg
                      width="20"
                      height="24"
                      viewBox="0 0 20 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.334 1.5V6.16667C12.334 6.47609 12.4569 6.77283 12.6757 6.99162C12.8945 7.21042 13.1912 7.33333 13.5007 7.33333H18.1673M12.334 1.5H4.16732C3.54848 1.5 2.95499 1.74583 2.5174 2.18342C2.07982 2.621 1.83398 3.21449 1.83398 3.83333V20.1667C1.83398 20.7855 2.07982 21.379 2.5174 21.8166C2.95499 22.2542 3.54848 22.5 4.16732 22.5H15.834C16.4528 22.5 17.0463 22.2542 17.4839 21.8166C17.9215 21.379 18.1673 20.7855 18.1673 20.1667V7.33333M12.334 1.5L18.1673 7.33333M6.50065 17.8333H13.5007M6.50065 13.1667H13.5007"
                        className="stroke-black dark:stroke-white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>

                    <p
                      className={
                        pathname && pathname.includes("experience")
                          ? "text-heading dark:text-darkHeading font-semibold text-xl"
                          : "text-paragraph dark:text-darkParagraph text-xl "
                      }
                    >
                      My Experience
                    </p>
                  </Link>
                  <Link
                    href="/profile/skillset"
                    className={
                      pathname && pathname.includes("skillset")
                        ? "flex items-center gap-4 px-4 py-3 border rounded-xl border-[#2BA98B]/20  backdrop-blur-lg bg-[#2BA98B]/5 "
                        : "flex items-center gap-4 px-4 py-3 rounded-xl hover:border-[#2BA98B]/20 cursor-pointer duration-200  ease-in-out    hover:bg-[#6bbba81a]"
                    }
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.5 12H2.66667M12 1.5V2.66667M21.3333 12H22.5M4.53333 4.53333L5.35 5.35M19.4667 4.53333L18.65 5.35M9.31666 17.8333H14.6833M8.5 16.6667C7.52055 15.9321 6.79706 14.9079 6.432 13.7393C6.06695 12.5707 6.07885 11.3168 6.46601 10.1553C6.85318 8.99385 7.59597 7.98362 8.58919 7.26775C9.58241 6.55188 10.7757 6.16667 12 6.16667C13.2243 6.16667 14.4176 6.55188 15.4108 7.26775C16.404 7.98362 17.1468 8.99385 17.534 10.1553C17.9211 11.3168 17.933 12.5707 17.568 13.7393C17.2029 14.9079 16.4795 15.9321 15.5 16.6667C15.0445 17.1176 14.7015 17.6694 14.4988 18.2774C14.2962 18.8854 14.2395 19.5326 14.3333 20.1667C14.3333 20.7855 14.0875 21.379 13.6499 21.8166C13.2123 22.2542 12.6188 22.5 12 22.5C11.3812 22.5 10.7877 22.2542 10.3501 21.8166C9.9125 21.379 9.66667 20.7855 9.66667 20.1667C9.76053 19.5326 9.70383 18.8854 9.50115 18.2774C9.29847 17.6694 8.9555 17.1176 8.5 16.6667Z"
                        className="stroke-black dark:stroke-white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>

                    <p
                      className={
                        pathname && pathname.includes("skillset")
                          ? "text-heading dark:text-darkHeading font-semibold text-xl"
                          : "text-paragraph dark:text-darkParagraph text-xl "
                      }
                    >
                      Skill Set
                    </p>
                  </Link>
                  <Link
                    href="/profile/support/issues"
                    className={
                      pathname && pathname.includes("support")
                        ? "flex items-center gap-4 px-4 py-3 border rounded-xl border-[#2BA98B]/20  backdrop-blur-lg bg-[#2BA98B]/5 "
                        : "flex items-center gap-4 px-4 py-3 rounded-xl hover:border-[#2BA98B]/20 cursor-pointer duration-200  ease-in-out    hover:bg-[#6bbba81a]"
                    }
                  >
                    <svg
                      width="20"
                      height="24"
                      viewBox="0 0 20 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.5 23.6673L10.2083 20.1673H9.91667C7.15556 20.1673 4.8125 19.2048 2.8875 17.2798C0.9625 15.3548 0 13.0118 0 10.2507C0 7.48954 0.9625 5.14648 2.8875 3.22148C4.8125 1.29648 7.15556 0.333984 9.91667 0.333984C11.2972 0.333984 12.5856 0.591429 13.7818 1.10632C14.9781 1.62121 16.0281 2.33093 16.9318 3.23548C17.8356 4.14004 18.5449 5.19004 19.0598 6.38548C19.5747 7.58093 19.8326 8.86932 19.8333 10.2507C19.8333 11.709 19.5953 13.109 19.1193 14.4507C18.6433 15.7923 17.9916 17.0368 17.164 18.184C16.338 19.3312 15.3561 20.3715 14.2182 21.3048C13.0803 22.2382 11.8409 23.0257 10.5 23.6673ZM12.8333 19.409C14.2139 18.2423 15.337 16.8765 16.2027 15.3117C17.0683 13.7468 17.5008 12.0598 17.5 10.2507C17.5 8.13121 16.7658 6.33765 15.2973 4.86998C13.8289 3.40232 12.0353 2.6681 9.91667 2.66732C7.79722 2.66732 6.00367 3.40154 4.536 4.86998C3.06833 6.33843 2.33411 8.13198 2.33333 10.2507C2.33333 12.3701 3.06756 14.164 4.536 15.6325C6.00444 17.1009 7.798 17.8348 9.91667 17.834H12.8333V19.409ZM9.8875 16.6382C10.2181 16.6382 10.5 16.5215 10.7333 16.2882C10.9667 16.0548 11.0833 15.7729 11.0833 15.4423C11.0833 15.1118 10.9667 14.8298 10.7333 14.5965C10.5 14.3632 10.2181 14.2465 9.8875 14.2465C9.55695 14.2465 9.275 14.3632 9.04167 14.5965C8.80833 14.8298 8.69167 15.1118 8.69167 15.4423C8.69167 15.7729 8.80833 16.0548 9.04167 16.2882C9.275 16.5215 9.55695 16.6382 9.8875 16.6382ZM9.04167 12.934H10.7917C10.7917 12.3507 10.85 11.9423 10.9667 11.709C11.0833 11.4757 11.4528 11.0479 12.075 10.4257C12.425 10.0757 12.7167 9.69649 12.95 9.28815C13.1833 8.87982 13.3 8.44232 13.3 7.97565C13.3 6.98398 12.9648 6.24043 12.2943 5.74498C11.6239 5.24954 10.8313 5.00143 9.91667 5.00065C9.06111 5.00065 8.34167 5.23904 7.75833 5.71582C7.175 6.1926 6.76667 6.77087 6.53333 7.45065L8.16667 8.09232C8.26389 7.76176 8.44861 7.43626 8.72083 7.11582C8.99306 6.79537 9.39167 6.63476 9.91667 6.63399C10.4417 6.63399 10.8356 6.77982 11.0985 7.07149C11.3614 7.36315 11.4924 7.68399 11.4917 8.03399C11.4917 8.36454 11.3944 8.66126 11.2 8.92415C11.0056 9.18704 10.7722 9.45421 10.5 9.72565C9.81945 10.309 9.40644 10.771 9.261 11.1117C9.11556 11.4523 9.04245 12.0598 9.04167 12.934Z"
                        className="fill-black dark:fill-[#C6C6C6]"
            
                      />
                    </svg>

                    <p
                      className={
                        pathname && pathname.includes("support")
                          ? "text-heading dark:text-darkHeading font-semibold text-xl"
                          : "text-paragraph dark:text-darkParagraph text-xl "
                      }
                    >
                      Support
                    </p>
                  </Link>
                  <div
                    onClick={logout}
                    className="flex mt-4 items-center gap-4 px-4 py-3 rounded-xl hover:border-[#2BA98B]/20 cursor-pointer duration-200  ease-in-out    hover:bg-[#6bbba81a]"
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.3333 9.33268V6.99935C16.3333 6.38051 16.0875 5.78702 15.6499 5.34943C15.2123 4.91185 14.6188 4.66602 14 4.66602H5.83333C5.21449 4.66602 4.621 4.91185 4.18342 5.34943C3.74583 5.78702 3.5 6.38051 3.5 6.99935V20.9994C3.5 21.6182 3.74583 22.2117 4.18342 22.6493C4.621 23.0869 5.21449 23.3327 5.83333 23.3327H14C14.6188 23.3327 15.2123 23.0869 15.6499 22.6493C16.0875 22.2117 16.3333 21.6182 16.3333 20.9994V18.666M8.16667 13.9993H24.5M24.5 13.9993L21 10.4993M24.5 13.9993L21 17.4993"
                        stroke="#D95344"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>

                    <p className="text-paragraph dark:text-darkParagraph text-xl ">
                      Logout
                    </p>
                  </div>
                </div>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
