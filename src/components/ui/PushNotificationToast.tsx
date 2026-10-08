interface PushNotificationToastProps {
  title: string;
  body?: string;
}

// Content for the in-page toast shown alongside a foreground FCM push.
// Generic on purpose - title/body come straight from the payload, so any
// future notification type renders without changes here.
export default function PushNotificationToast({ title, body }: PushNotificationToastProps) {
  return (
    <div className="font-body">
      <p className="font-semibold text-ink">{title}</p>
      {body && <p className="mt-0.5 text-sm text-bark/80">{body}</p>}
    </div>
  );
}
