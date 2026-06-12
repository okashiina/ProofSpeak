"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/client";
import type { Story, Order, Contact, Product } from "@/lib/db/schema";
import type { ContentMap } from "@/lib/types";
import DashboardPanel from "./panels/DashboardPanel";
import ContentPanel from "./panels/ContentPanel";
import ImagesPanel from "./panels/ImagesPanel";
import ProductsPanel from "./panels/ProductsPanel";
import StoriesPanel from "./panels/StoriesPanel";
import OrdersPanel from "./panels/OrdersPanel";
import ContactsPanel from "./panels/ContactsPanel";
import SettingsPanel from "./panels/SettingsPanel";

type Tab = "dash" | "content" | "images" | "products" | "stories" | "orders" | "contacts" | "settings";

export default function AdminApp({
  email,
  initialStories,
  initialOrders,
  initialContacts,
  initialProducts,
  initialContent,
}: {
  email: string;
  initialStories: Story[];
  initialOrders: Order[];
  initialContacts: Contact[];
  initialProducts: Product[];
  initialContent: ContentMap;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("dash");
  const [stories, setStories] = useState(initialStories);
  const [orders, setOrders] = useState(initialOrders);
  const [contacts, setContacts] = useState(initialContacts);
  const [products, setProducts] = useState(initialProducts);
  const [content, setContent] = useState(initialContent);

  const pendingCount = stories.filter((s) => s.status === "pending").length;
  const newContacts = contacts.filter((c) => c.status === "new").length;

  async function logout() {
    await apiPost("/api/seller/logout", {});
    router.refresh();
  }

  const groups: { title: string; items: { id: Tab; label: string; badge?: number }[] }[] = [
    { title: "Ringkasan", items: [{ id: "dash", label: "Dashboard" }] },
    {
      title: "Konten",
      items: [
        { id: "content", label: "Editor Teks" },
        { id: "images", label: "Gambar" },
        { id: "products", label: "Produk Kalung" },
      ],
    },
    {
      title: "Masuk",
      items: [
        { id: "stories", label: "Moderasi Cerita", badge: pendingCount },
        { id: "orders", label: "Pesanan" },
        { id: "contacts", label: "Pesan Kontak", badge: newContacts },
      ],
    },
    { title: "Pengaturan", items: [{ id: "settings", label: "Pengaturan" }] },
  ];

  return (
    <div className="admin-shell">
      <header className="admin-top">
        <div className="admin-brand">
          ProofSpeak <b>· Admin</b>
        </div>
        <div className="admin-top-actions">
          <a href="/" target="_blank" rel="noopener noreferrer">
            Lihat Situs
          </a>
          <button className="logout" onClick={logout}>
            Keluar
          </button>
        </div>
      </header>

      <div className="admin-body">
        <nav className="admin-sidebar" aria-label="Menu admin">
          {groups.map((g) => (
            <div key={g.title}>
              <div className="sb-sec">{g.title}</div>
              {g.items.map((it) => (
                <button
                  key={it.id}
                  className={`sb-btn ${tab === it.id ? "act" : ""}`}
                  onClick={() => setTab(it.id)}
                >
                  {it.label}
                  {it.badge ? <span className="sb-badge">{it.badge}</span> : null}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <main className="admin-main">
          {tab === "dash" && (
            <DashboardPanel
              stories={stories}
              orders={orders}
              contacts={contacts}
              products={products}
              setStories={setStories}
              onGoto={(t) => setTab(t as Tab)}
            />
          )}
          {tab === "content" && <ContentPanel content={content} setContent={setContent} />}
          {tab === "images" && <ImagesPanel content={content} setContent={setContent} />}
          {tab === "products" && <ProductsPanel products={products} setProducts={setProducts} />}
          {tab === "stories" && <StoriesPanel stories={stories} setStories={setStories} />}
          {tab === "orders" && <OrdersPanel orders={orders} setOrders={setOrders} />}
          {tab === "contacts" && <ContactsPanel contacts={contacts} setContacts={setContacts} />}
          {tab === "settings" && <SettingsPanel email={email} />}
        </main>
      </div>
    </div>
  );
}
