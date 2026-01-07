import { useState } from "react";
import type { MenuItem } from "../../types/MenuItem";
import { getMenuItems } from "../../services/menu.service";

export default function Menu() {
    const [items, setItems] = useState<MenuItem[]>([]);
    
    async function loadItems() {
        const data = await getMenuItems();
        setItems(data);
    }

    return (
        <div>
            <h1>Menu</h1>
            <button onClick={loadItems}>Load Menu Items</button>
            <ul>
                {items.map(item => <li key={item.id}>{item.name} - ${item.price}</li>)}
            </ul>
        </div>
);
}