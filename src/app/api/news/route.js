import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Helper para validar dados
const validateNewsletter = (data) => {
  if (!data.titulo || !data.descricao || !data.criador_id) {
    return { isValid: false, message: 'Título, descrição e criador_id são obrigatórios' };
  }
  
  // Verifica se pelo menos um formato de conteúdo foi fornecido
  const hasStructuredContent = data.conteudo && Array.isArray(data.conteudo);
  const hasMarkdownContent = data.markdown && typeof data.markdown === 'string';
  
  if (!hasStructuredContent && !hasMarkdownContent) {
    return { 
      isValid: false, 
      message: 'Forneça conteúdo estruturado (conteudo) ou markdown' 
    };
  }

  return { isValid: true };
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db();

    const newsletters = await db.collection('newsletters')
      .find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection('newsletters').countDocuments();

    return Response.json({
      data: newsletters,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });

  } catch (error) {
    console.error('GET newsletters error:', error);
    return Response.json(
      { message: 'Erro ao buscar newsletters' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const validation = validateNewsletter(data);

    if (!validation.isValid) {
      return Response.json(
        { message: validation.message },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Verificar se o criador existe
    const creatorExists = await db.collection('users').findOne({ 
      _id: new ObjectId(data.criador_id) 
    });

    if (!creatorExists) {
      return Response.json(
        { message: 'Criador não encontrado' },
        { status: 404 }
      );
    }

    const now = new Date();
    const newsletterData = {
      titulo: data.titulo,
      descricao: data.descricao,
      img: data.img || null,
      criador_id: new ObjectId(data.criador_id),
      created_at: now,
      updated_at: now,
      // Campos de conteúdo (um ou ambos podem estar presentes)
      conteudo: data.conteudo || null,
      markdown: data.markdown || null,
      // Metadados para identificar o tipo de conteúdo
      content_type: data.markdown ? 'markdown' : 'structured'
    };

    const result = await db.collection('newsletters').insertOne(newsletterData);

    return Response.json(
      { 
        message: 'Newsletter criada com sucesso',
        id: result.insertedId 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('POST newsletter error:', error);
    return Response.json(
      { message: 'Erro ao criar newsletter' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return Response.json(
        { message: 'ID da newsletter é obrigatório' },
        { status: 400 }
      );
    }

    const data = await request.json();
    const validation = validateNewsletter(data);

    if (!validation.isValid) {
      return Response.json(
        { message: validation.message },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const existingNewsletter = await db.collection('newsletters').findOne({ 
      _id: new ObjectId(id) 
    });

    if (!existingNewsletter) {
      return Response.json(
        { message: 'Newsletter não encontrada' },
        { status: 404 }
      );
    }

    const updateData = {
      titulo: data.titulo || existingNewsletter.titulo,
      descricao: data.descricao || existingNewsletter.descricao,
      img: data.img || existingNewsletter.img,
      updated_at: new Date(),
      created_at: existingNewsletter.created_at,
      // Atualiza os campos de conteúdo conforme fornecido
      conteudo: data.conteudo !== undefined ? data.conteudo : existingNewsletter.conteudo,
      markdown: data.markdown !== undefined ? data.markdown : existingNewsletter.markdown,
      // Atualiza o tipo de conteúdo
      content_type: data.markdown ? 'markdown' : 
                   data.conteudo ? 'structured' : 
                   existingNewsletter.content_type
    };

    await db.collection('newsletters').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return Response.json(
      { message: 'Newsletter atualizada com sucesso' },
      { status: 200 }
    );

  } catch (error) {
    console.error('PUT newsletter error:', error);
    return Response.json(
      { message: 'Erro ao atualizar newsletter' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return Response.json(
        { message: 'ID da newsletter é obrigatório' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('newsletters').deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return Response.json(
        { message: 'Newsletter não encontrada' },
        { status: 404 }
      );
    }

    return Response.json(
      { message: 'Newsletter excluída com sucesso' },
      { status: 200 }
    );

  } catch (error) {
    console.error('DELETE newsletter error:', error);
    return Response.json(
      { message: 'Erro ao excluir newsletter' },
      { status: 500 }
    );
  }
}