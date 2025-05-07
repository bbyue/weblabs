import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './styles.module.scss';

export interface EventData {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  owner: string;
}

interface EventFormProps {
  initialData?: Partial<EventData>;
  onSubmit: (data: EventData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// Update schema to match EventData exactly
const schema: yup.ObjectSchema<EventData> = yup.object().shape({
  id: yup.number().required(),
  title: yup.string().required('Название обязательно').max(100),
  description: yup.string().required('Описание обязательно').max(500),
  date: yup.string()
    .required('Дата обязательна')
    .test('is-future', 'Дата должна быть в будущем', (value) => {
      if (!value) return false;
      return new Date(value) > new Date();
    }),
  location: yup.string().required('Место проведения обязательно'),
  image: yup.string().optional().default(''),
  owner: yup.string().required('Владелец обязателен'),
});

const EventForm = ({ initialData, onSubmit, onCancel, isSubmitting }: EventFormProps) => {
  const { 
    register, 
    handleSubmit, 
    control,
    formState: { errors },
  } = useForm<EventData>({
    resolver: yupResolver(schema),
    defaultValues: {
      id: 0,
      title: '',
      description: '',
      date: new Date().toISOString(),
      location: '',
      image: '',
      owner: '',
      ...initialData
    }
  });

  const handleFormSubmit = (data: EventData) => {
    onSubmit(data);
  };
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.eventForm}>
      <div className={styles.formGroup}>
        <label>Название</label>
        <input {...register('title')} />
        {errors.title && <span className={styles.error}>{errors.title.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label>Описание</label>
        <textarea {...register('description')} rows={4} />
        {errors.description && <span className={styles.error}>{errors.description.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label>Дата</label>
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <DatePicker
              selected={field.value ? new Date(field.value) : null}
              onChange={(date: Date | null) => {
                if (date) {
                  field.onChange(date.toISOString());
                }
              }}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={new Date()}
            />
          )}
        />
        {errors.date && <span className={styles.error}>{errors.date.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label>Место проведения</label>
        <input {...register('location')} />
        {errors.location && <span className={styles.error}>{errors.location.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label>URL изображения</label>
        <input {...register('image')} />
        {errors.image && <span className={styles.error}>{errors.image.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label>Владелец</label>
        <input {...register('owner')} />
        {errors.owner && <span className={styles.error}>{errors.owner.message}</span>}
      </div>

      <div className={styles.buttons}>
        <button 
          type="button" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Отмена
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;