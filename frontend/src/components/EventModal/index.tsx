import { useState } from 'react';
import Modal from '../Modal';
import EventForm from '../EventForm';
import styles from './styles.module.scss';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Event | null;
  onSave: (event: Event) => Promise<void>;
}

const EventModal = ({ isOpen, onClose, initialData, onSave }: EventModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Event) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalContent}>
        <h2>{initialData ? 'Редактирование мероприятия' : 'Создание мероприятия'}</h2>
        <EventForm
          initialData={initialData || undefined}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </div>
    </Modal>
  );
};

export default EventModal;