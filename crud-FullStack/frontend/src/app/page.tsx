'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';

interface Nota {
  id: number;
  title: string;
  body: string;
  autor: string;
  tags: string[];
  fecha: string;
}

export default function Home() {
  const [notas, setnotas] = useState<Nota[]>([]);
  const [form, setForm] = useState<Omit<Nota, 'id'>>({
    title: '',
    body: '',
    autor: '',
    tags: [],
    fecha: new Date().toISOString().split('T')[0],
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const notasPorPagina = 1;

  useEffect(() => {
    fetchnotas();
  }, []);

  const fetchnotas = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notas');
      setnotas(res.data);
    } catch (err) {
      console.error('Error fetching notas', err);
    }
  };

  const createNota = async () => {
    try {
      await axios.post('http://localhost:5000/api/notas', form);
      setForm({ title: '', body: '', autor: '', tags: [], fecha: new Date().toISOString().split('T')[0] });
      fetchnotas();
    } catch (err) {
      console.error('Error creating Nota', err);
    }
  };

  const updateNota = async (id: number) => {
    try {
      await axios.put(`http://localhost:5000/api/notas/${id}`, form);
      setEditingId(null);
      setForm({ title: '', body: '', autor: '', tags: [], fecha: new Date().toISOString().split('T')[0] });
      fetchnotas();
    } catch (err) {
      console.error('Error updating Nota', err);
    }
  };

  const deleteNota = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/notas/${id}`);
      fetchnotas();
    } catch (err) {
      console.error('Error deleting Nota', err);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'tags' ? value.split(',') : value });
  };

  const notasFiltradas = notas.filter((nota) =>
    `${nota.title} ${nota.body} ${nota.autor}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPaginas = Math.ceil(notasFiltradas.length / notasPorPagina);
  const notaActual = notasFiltradas.slice(
    (currentPage - 1) * notasPorPagina,
    currentPage * notasPorPagina
  );

  const cambiarPagina = (dir: number) => {
    setCurrentPage((prev) => {
      const nueva = prev + dir;
      return nueva < 1 ? 1 : nueva > totalPaginas ? totalPaginas : nueva;
    });
  };

  return (
    <div className="container mx-auto max-w-2xl p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">CRUD FullStack</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por título, autor o cuerpo..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); 
          }}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-6 space-y-4">
        <input name="title" value={form.title} onChange={handleInput} placeholder="Title" className="w-full p-3 border border-gray-300 rounded" />
        <input name="body" value={form.body} onChange={handleInput} placeholder="Body" className="w-full p-3 border border-gray-300 rounded" />
        <input name="autor" value={form.autor} onChange={handleInput} placeholder="Autor" className="w-full p-3 border border-gray-300 rounded" />
        <input name="tags" value={form.tags.join(',')} onChange={handleInput} placeholder="Tags (comma separated)" className="w-full p-3 border border-gray-300 rounded" />
        <input name="fecha" type="date" value={form.fecha} onChange={handleInput} className="w-full p-3 border border-gray-300 rounded" />

        {editingId ? (
          <button onClick={() => updateNota(editingId)} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded transition">
            Update Noticia
          </button>
        ) : (
          <button onClick={createNota} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition">
            Add Nota
          </button>
        )}
      </div>

      <ul className="space-y-4">
        {notaActual.map((Nota) => (
          <li key={Nota.id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-gray-800">{Nota.title}</h2>
            <p className="text-gray-700">{Nota.body}</p>
            <p className="text-sm text-gray-500 mt-1">Autor: {Nota.autor}</p>
            <p className="text-sm text-gray-500">Tags: {Nota.tags.join(', ')}</p>
            <p className="text-sm text-gray-500">Date: {Nota.fecha}</p>

            <div className="space-x-2 mt-4">
              <button onClick={() => {
                setForm({
                  title: Nota.title,
                  body: Nota.body,
                  autor: Nota.autor,
                  tags: Nota.tags,
                  fecha: Nota.fecha,
                });
                setEditingId(Nota.id);
              }} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded transition">Edit</button>
              <button onClick={() => deleteNota(Nota.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      
      <div className="flex justify-between mt-6">
        <button onClick={() => cambiarPagina(-1)} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Anterior</button>
        <span className="self-center text-gray-600">Página {currentPage} de {totalPaginas}</span>
        <button onClick={() => cambiarPagina(1)} disabled={currentPage === totalPaginas} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Siguiente</button>
      </div>
    </div>
  );
}
