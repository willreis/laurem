import clientPromise from '@/lib/mongodb';
import { comparePasswords } from '@/lib/authUtils';
import { SignJWT } from 'jose';
import { getJwtSecretKey } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { message: 'E-mail e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Buscar usuário
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return Response.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Verificar senha
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return Response.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Criar token JWT
    const token = await new SignJWT({ userId: user._id.toString(), email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(getJwtSecretKey());

    // Retornar resposta sem a senha
    const { password: _, ...userWithoutPassword } = user;

    return Response.json(
      { 
        message: 'Login bem-sucedido',
        user: userWithoutPassword,
        token 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}