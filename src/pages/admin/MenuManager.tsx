import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createMenuItem,
  getMenuItems,
  deleteMenuItem,
} from "../../services/menu.service";

import type { MenuItem } from "../../types/MenuItem";

export default function MenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

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
      price: Number(price),
    });

    setName("");
    setPrice("");
    loadItems();
  }

  async function handleDelete(id: string) {
    await deleteMenuItem(id);
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
            {item.name} - R$ {item.price}
            <button onClick={() => handleDelete(item.id!)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
