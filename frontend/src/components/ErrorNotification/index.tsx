import styles from "./styles.module.scss";

interface ErrorNotificationProps {
  message: string;
  onClose: () => void;
}

export const ErrorNotification = ({ message, onClose }: ErrorNotificationProps) => (
  <div className={styles.error}>
    <span>{message}</span>
    <button onClick={onClose}>×</button>
  </div>
);