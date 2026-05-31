import NotificationsPageClient from "../_components/NotificationsPageClient";

type NotificationsByCoursePageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function NotificationsByCoursePage({
  params,
}: NotificationsByCoursePageProps) {
  const { courseId } = await params;

  return <NotificationsPageClient courseId={courseId} />;
}
