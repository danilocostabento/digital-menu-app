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
    <div className="app-shell">
      <div className="card">
        <h1 className="card__title">Gerenciar Cardápio</h1>
        <p className="card__section-title">
          <Link to="/admin/dashboard">Voltar ao Dashboard</Link>
        </p>

        <h2 className="card__section-title">Novo item</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Nome</label>
            <input
              placeholder="Ex: X-Burger Especial"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Descrição</label>
            <input
              placeholder="Ingredientes, observações..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Preço</label>
            <input
              placeholder="Ex: 29.90"
              type="number"
              step="0.01"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button className="btn-primary" type="submit">Adicionar</button>
          </div>
        </form>

        <h2 className="card__section-title">Itens</h2>
        <ul>
        {items.map(item => (
          <li key={item.id}>
            {editingId === item.id ? (
              <>
                  <div className="form-field">
                    <label>Nome</label>
                    <input
                      placeholder="Item name"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>Descrição</label>
                    <input
                      placeholder="Description"
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>Preço</label>
                    <input
                      placeholder="Price"
                      type="number"
                      value={editPrice}
                      onChange={e => setEditPrice(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>
                      <input
                        type="checkbox"
                        checked={editActive}
                        onChange={e => setEditActive(e.target.checked)}
                      />
                      {" "}Ativo (em estoque)
                    </label>
                  </div>
                  <div className="form-actions">
                    <button
                      className="btn-primary"
                      type="button"
                      onClick={() => handleSaveEdit(item.id!)}
                    >
                      Salvar
                    </button>
                    <button type="button" className="btn-ghost" onClick={cancelEdit}>
                      Cancelar
                    </button>
                  </div>
              </>
            ) : (
              <>
                <span>
                  {item.name} - R$ {item.price} {" "}
                  {!item.active && <strong>(Fora de estoque)</strong>}
                </span>
                {item.description && <p>{item.description}</p>}
                  <div className="form-actions">
                    <button
                      className="btn-ghost"
                      type="button"
                      onClick={() => startEdit(item)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-ghost"
                      type="button"
                      onClick={() => handleToggleActive(item)}
                    >
                      {item.active ? "Marcar como fora de estoque" : "Marcar como disponível"}
                    </button>
                    <button
                      className="btn-ghost"
                      type="button"
                      onClick={() => handleDelete(item.id!)}
                    >
                      Excluir
                    </button>
                  </div>
              </>
            )}
          </li>
        ))}
        </ul>
      </div>
    </div>
  );
}
