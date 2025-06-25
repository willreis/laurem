import clientPromise from '@/lib/mongodb';
import { hashPassword, validateEmail, validatePassword } from '@/lib/authUtils';

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    // Validação
    if (!email || !password || !name) {
      return Response.json(
        { message: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return Response.json(
        { message: 'E-mail inválido' },
        { status: 400 }
      );
    }

    if (!validatePassword(password)) {
      return Response.json(
        { message: 'Senha deve ter pelo menos 8 caracteres' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Verificar se usuário já existe
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return Response.json(
        { message: 'Usuário já existe' },
        { status: 409 }
      );
    }

    // Criar novo usuário
    const hashedPassword = await hashPassword(password);
    const newUser = {
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('users').insertOne(newUser);

    return Response.json(
      { 
        message: 'Usuário criado com sucesso',
        userId: result.insertedId 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return Response.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}