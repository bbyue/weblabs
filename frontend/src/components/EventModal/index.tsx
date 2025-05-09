import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Event } from "../../types/event";
import styles from "./styles.module.scss";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Event, 'id' | 'createdBy'>) => void;
  initialData?: Event | null;
}
export const EventModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: EventModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<Omit<Event, 'id' | 'createdBy'>>();

  useEffect(() => {
    if (initialData) {
      const dateValue = initialData.date.slice(0, 16);
      setValue('title', initialData.title);
      setValue('description', initialData.description);
      setValue('date', dateValue);
    } else {
      reset({
        title: '',
        description: '',
        date: ''
      });
    }
  }, [initialData, setValue, reset]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFormSubmit = async (data: Omit<Event, 'id' | 'createdBy'>) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onClose();
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Failed to save event"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.modalTitle}>
          {initialData ? "Редактировать мероприятие" : "Создать мероприятие"}
        </h2>
        
        {submitError && (
          <div className={styles.errorMessage}>{submitError}</div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.eventForm}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Название*</label>
            <input
              id="title"
              {...register("title", {
                required: "Обязательное поле!",
                minLength: {
                  value: 3,
                  message: "Минимум 3 символа",
                },
                maxLength: {
                  value: 100,
                  message: "Максимум 100 символов",
                },
              })}
              className={errors.title ? styles.errorInput : ""}
            />
            {errors.title && (
              <span className={styles.errorMessage}>{errors.title.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Описание*</label>
            <textarea
              id="description"
              {...register("description", {
                required: "Обязательное поле!",
                minLength: {
                  value: 10,
                  message: "Минимум 10 символов",
                },
                maxLength: {
                  value: 500,
                  message: "Максимум 500 символов",
                },
              })}
              rows={4}
              className={errors.description ? styles.errorInput : ""}
            />
            {errors.description && (
              <span className={styles.errorMessage}>{errors.description.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="date">Дата и время*</label>
            <input
              type="datetime-local"
              id="date"
              {...register("date", {
                required: "Обязательное поле!",
                validate: (value) => {
                  if (!value) return "Обязательное поле!";
                  const selectedDate = new Date(value);
                  const now = new Date();
                  return selectedDate > now || "Дата должна быть в будущем";
                },
              })}
              className={errors.date ? styles.errorInput : ""}
            />
            {errors.date && (
              <span className={styles.errorMessage}>{errors.date.message}</span>
            )}
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.closeButton}
              disabled={isSubmitting}
            >
            
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};