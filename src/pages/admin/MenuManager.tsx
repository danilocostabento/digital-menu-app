import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createMenuItem,
  getMenuItems,
  deleteMenuItem,
  updateMenuItem,
} from "../../services/menu.service";

import type { MenuItem } from "../../types/MenuItem";

export default function MenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editActive, setEditActive] = useState(false);

  async function loadItems() {
    const data = await getMenuItems();
    setItems(data);
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await createMenuItem({
      name,
      description,
      price: Number(price),
    });

    setName("");
    setDescription("");
    setPrice("");
    loadItems();
  }

  async function handleDelete(id: string) {
    await deleteMenuItem(id);
    loadItems();
  }

  function startEdit(item: MenuItem) {
    if (!item.id) return;
    setEditingId(item.id);
    setEditName(item.name);
    setEditDescription(item.description ?? "");
    setEditPrice(String(item.price));
    setEditActive(item.active);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
    setEditPrice("");
    setEditActive(false);
  }

  async function handleSaveEdit(id: string) {
    await updateMenuItem(id, {
      name: editName,
      description: editDescription,
      price: Number(editPrice),
      active: editActive,
    });
    cancelEdit();
    loadItems();
  }

  async function handleToggleActive(item: MenuItem) {
    if (!item.id) return;
    await updateMenuItem(item.id, { active: !item.active });
    loadItems();
  }

  return (
    <div>
      <h1>Menu Manager</h1>
      <Link to="/admin/dashboard">Voltar ao Dashboard</Link>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Item name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />

        <button type="submit">Add</button>
      </form>

      <ul>
        {items.map(item => (
          <li key={item.id}>
            {editingId === item.id ? (
              <>
                <input
                  placeholder="Item name"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
                <input
                  placeholder="Description"
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                />
                <input
                  placeholder="Price"
                  type="number"
                  value={editPrice}
                  onChange={e => setEditPrice(e.target.value)}
                />
                <label>
                  <input
                    type="checkbox"
                    checked={editActive}
                    onChange={e => setEditActive(e.target.checked)}
                  />
                  Ativo (em estoque)
                </label>
                <button type="button" onClick={() => handleSaveEdit(item.id!)}>
                  Salvar
                </button>
                <button type="button" onClick={cancelEdit}>
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span>
                  {item.name} - R$ {item.price} {" "}
                  {!item.active && <strong>(Fora de estoque)</strong>}
                </span>
                {item.description && <p>{item.description}</p>}
                <button type="button" onClick={() => startEdit(item)}>
                  Editar
                </button>
                <button type="button" onClick={() => handleToggleActive(item)}>
                  {item.active ? "Marcar como fora de estoque" : "Marcar como disponível"}
                </button>
                <button type="button" onClick={() => handleDelete(item.id!)}>
                  Excluir
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
