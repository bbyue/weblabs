import router from '@routes/auth.js';
/*
interface UserData {
  name: string;
  email: string;
  password: string;
}

const createUser = async (userData: UserData): Promise<User> => {
  const { name, email, password } = userData;

  if (!name || !email || !password) {
    throw new Error('Необходимы обязательные поля: name, email, password');
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Пользователь с таким email уже существует');
  }

  return await User.create({
    name,
    email,
    password,
    createdAt: new Date(),
  });
};

const getAllUsers = async (): Promise<User[]> => {
  return await User.findAll();
};

interface DeleteResult {
  message: string;
}

const deleteUser = async (userId: number): Promise<DeleteResult> => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('Пользователь не найден');
  }
  await user.destroy();
  return { message: 'Пользователь успешно удален' };
};
*/
export default router;
