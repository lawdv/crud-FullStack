import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Crear tarea
router.post('/', async (req, res) => {
  const { title, body, autor, tags, fecha } = req.body;

  try {
    const noticias = await prisma.crudfullstack.create({
      data: {
        title,
        body,
        autor,
        tags: Array.isArray(tags) ? tags.join(',') : tags,
        fecha: new Date(fecha),
      },
    });
    res.status(201).json({
      ...noticias,
      tags: noticias.tags.split(','),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating noticias', detail: error });
  }
});

// Obtener todas las tareas
router.get('/', async (req, res) => {
  try {
    const noticiass = await prisma.crudfullstack.findMany();
    const noticiassWithArrayTags = noticiass.map((noticias: { tags: string; }) => ({
      ...noticias,
      tags: noticias.tags.split(','),
    }));
    res.json(noticiassWithArrayTags);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching noticiass' });
  }
});


// Actualizar tarea
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, body, autor, tags, fecha } = req.body;

  try {
    const updated = await prisma.crudfullstack.update({
      where: { id: parseInt(id) },
      data: {
        title,
        body,
        autor,
        tags: Array.isArray(tags) ? tags.join(',') : tags,
        fecha: new Date(fecha),
      },
    });
    res.json({
      ...updated,
      tags: updated.tags.split(','),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating noticias' });
  }
});


// Eliminar tarea
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.crudfullstack.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting noticias' });
  }
});


export default router;
