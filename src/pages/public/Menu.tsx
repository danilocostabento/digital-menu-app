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
        <div>
            <h1>Menu</h1>
            <ul>
                {visibleItems.map(item => (
                    <li key={item.id}>
                        <strong>{item.name}</strong>
                        {item.description && <p>{item.description}</p>}
                        <p>R$ {item.price.toFixed(2)}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}