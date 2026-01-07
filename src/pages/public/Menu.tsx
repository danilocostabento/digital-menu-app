import { useEffect, useState } from "react";
import type { MenuItem } from "../../types/MenuItem";
import { getMenuItems } from "../../services/menu.service";

export default function Menu() {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | "ALL">("ALL");

    useEffect(() => {
        async function loadItems() {
            const data = await getMenuItems();
            setItems(data);
        }

        loadItems();
    }, []);

    const categories = Array.from(
        new Set(
            items
                .map((item) => item.category)
                .filter((cat): cat is string => !!cat)
        )
    ).sort();

    const visibleItems = items.filter(item =>
        item.active && (selectedCategory === "ALL" || item.category === selectedCategory)
    );

    return (
        <div className="app-shell">
            <div className="card">
                <h1 className="card__title">Cardápio</h1>

                {categories.length > 0 && (
                    <div className="form-actions" style={{ marginBottom: "1rem" }}>
                        <button
                            type="button"
                            className={selectedCategory === "ALL" ? "btn-primary" : "btn-ghost"}
                            onClick={() => setSelectedCategory("ALL")}
                        >
                            Todas
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                className={selectedCategory === cat ? "btn-primary" : "btn-ghost"}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
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