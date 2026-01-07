import { useEffect, useState } from "react";
import type { MenuItem } from "../../types/MenuItem";
import { getMenuItems } from "../../services/menu.service";

export default function Menu() {
    const [items, setItems] = useState<MenuItem[]>([]);

    useEffect(() => {
        async function loadItems() {
            const data = await getMenuItems();
            setItems(data);
        }

        loadItems();
    }, []);

    const visibleItems = items.filter(item => item.active);

    return (
        <div className="app-shell">
            <div className="card">
                <h1 className="card__title">Cardápio</h1>
                <div className="menu-list">
                    {visibleItems.map(item => (
                        <article key={item.id} className="menu-card">
                            <h2 className="menu-card__name">{item.name}</h2>
                            {item.description && (
                                <p className="menu-card__desc">{item.description}</p>
                            )}
                            <p className="menu-card__price">R$ {item.price.toFixed(2)}</p>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}