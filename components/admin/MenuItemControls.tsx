"use client";

import { useTransition, useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import {
  toggleMenuItemAvailability,
  deleteMenuItemAction,
  createMenuItemAction,
} from "@/actions/admin-menu";
import { UserRole } from "@prisma/client";

interface MenuItemDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  categoryName?: string;
  isAvailable: boolean;
  isFeatured: boolean;
}

interface MenuItemControlsProps {
  items: MenuItemDto[];
  categories: { id: string; name: string }[];
  userRole: UserRole;
}

export function MenuItemControls({
  items,
  categories,
  userRole,
}: MenuItemControlsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (id: string) => {
    startTransition(async () => {
      await toggleMenuItemAvailability(id);
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you certain you wish to delete "${name}" from the menu?`)) {
      startTransition(async () => {
        await deleteMenuItemAction(id);
      });
    }
  };

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const imageUrl = formData.get("imageUrl") as string;
    const categoryId = formData.get("categoryId") as string;
    const ingredients = (formData.get("ingredients") as string)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const dietaryTags = (formData.get("dietaryTags") as string)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const allergens = (formData.get("allergens") as string)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const isFeatured = formData.get("isFeatured") === "on";

    startTransition(async () => {
      await createMenuItemAction({
        name,
        slug,
        description,
        price,
        imageUrl,
        categoryId,
        ingredients,
        dietaryTags,
        allergens,
        isFeatured,
      });
      setModalOpen(false);
    });
  };

  return (
    <>
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#FAB44D] font-semibold">
            Culinary Offerings
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F3EEE7]">
            Menu Inventory & Availability
          </h1>
          <p className="text-xs text-[#DED7CB]/70 mt-1">
            Toggle daily availability or add new Mediterranean dishes
          </p>
        </div>

        {userRole === "ADMIN" && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="h-10 px-4 bg-[#D47D57] hover:bg-[#B25337] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add Dish</span>
          </button>
        )}
      </div>

      {/* Dishes Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141C16] text-[#DED7CB]/60 uppercase tracking-wider text-[10px] border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Dish</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Availability</th>
                {userRole === "ADMIN" && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#0C100D] shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-serif font-bold text-[#F3EEE7] text-sm block">
                          {item.name}
                        </span>
                        {item.isFeatured && (
                          <span className="text-[10px] text-[#FAB44D] font-semibold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px] material-symbols-fill">star</span>
                            Featured Signature
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-[#DED7CB]/80">
                    {item.categoryName || "General"}
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-[#FAB44D]">
                    {formatPrice(item.price)}
                  </td>

                  <td className="py-3 px-4">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleToggle(item.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                        item.isAvailable
                          ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                          : "bg-red-950/60 border-red-500/40 text-red-300"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.isAvailable ? "bg-emerald-400" : "bg-red-400"
                        }`}
                      />
                      <span>{item.isAvailable ? "Available" : "Sold Out"}</span>
                    </button>
                  </td>

                  {userRole === "ADMIN" && (
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleDelete(item.id, item.name)}
                        className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-950/30 transition-colors"
                        title="Delete Dish"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          delete
                        </span>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Dish Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div className="bg-[#141C16] border border-white/10 rounded-2xl max-w-lg w-full p-6 text-[#F3EEE7] shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="font-serif text-lg font-bold">Add Mediterranean Dish</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-lg glass-obsidian flex items-center justify-center text-[#DED7CB]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#DED7CB]/70 uppercase block mb-1">
                  Dish Name *
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Charred Aegean Octopus"
                  className="w-full h-10 px-3 rounded-lg bg-[#0C100D] border border-white/10 text-[#F3EEE7] focus:outline-none focus:border-[#FAB44D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#DED7CB]/70 uppercase block mb-1">
                    Price ($) *
                  </label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    placeholder="28.00"
                    className="w-full h-10 px-3 rounded-lg bg-[#0C100D] border border-white/10 text-[#F3EEE7] focus:outline-none focus:border-[#FAB44D]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#DED7CB]/70 uppercase block mb-1">
                    Category *
                  </label>
                  <select
                    name="categoryId"
                    required
                    className="w-full h-10 px-3 rounded-lg bg-[#0C100D] border border-white/10 text-[#F3EEE7] focus:outline-none focus:border-[#FAB44D]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#DED7CB]/70 uppercase block mb-1">
                  Image URL *
                </label>
                <input
                  name="imageUrl"
                  type="url"
                  required
                  defaultValue="https://lh3.googleusercontent.com/aida-public/AB6AXuATG1kgo_DXFmuq9YQqtF96zI1S36XPWMRHt7JnaeCd-mmB6odsN6nyMxXwZgW1hAanHfoQQrnJkBvDTUiJ7ZjcoMe1wv_hcQOVwnv-S0ma9Fnb7q0f8r6yChbvHB0xp8FabMkCsjDH0LacSrAKuCxid_4OUsFf1RBBHwp_Ic-mxbkacz0DuOlXqBXFQcgiDqnaNUPSdzR7RXO33cWyDhddrQ_9YMcO887DqKavS828x8g8cyBrgKLpFQ"
                  className="w-full h-10 px-3 rounded-lg bg-[#0C100D] border border-white/10 text-[#F3EEE7] focus:outline-none focus:border-[#FAB44D]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#DED7CB]/70 uppercase block mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  rows={2}
                  required
                  placeholder="Sensory description of tasting experience..."
                  className="w-full p-2.5 rounded-lg bg-[#0C100D] border border-white/10 text-[#F3EEE7] focus:outline-none focus:border-[#FAB44D] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#DED7CB]/70 uppercase block mb-1">
                    Ingredients (comma separated)
                  </label>
                  <input
                    name="ingredients"
                    type="text"
                    defaultValue="Octopus, Fava, Olive Oil"
                    className="w-full h-10 px-3 rounded-lg bg-[#0C100D] border border-white/10 text-[#F3EEE7] focus:outline-none focus:border-[#FAB44D]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#DED7CB]/70 uppercase block mb-1">
                    Dietary Tags (comma separated)
                  </label>
                  <input
                    name="dietaryTags"
                    type="text"
                    defaultValue="Gluten-Free"
                    className="w-full h-10 px-3 rounded-lg bg-[#0C100D] border border-white/10 text-[#F3EEE7] focus:outline-none focus:border-[#FAB44D]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#DED7CB]/70 uppercase block mb-1">
                  Allergens (comma separated)
                </label>
                <input
                  name="allergens"
                  type="text"
                  defaultValue="Molluscs"
                  className="w-full h-10 px-3 rounded-lg bg-[#0C100D] border border-white/10 text-[#F3EEE7] focus:outline-none focus:border-[#FAB44D]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  className="rounded accent-[#D47D57]"
                />
                <label htmlFor="isFeatured" className="text-xs text-[#DED7CB]">
                  Mark as Chef&apos;s Signature / Featured Dish
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 glass-obsidian rounded-lg hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 bg-[#D47D57] hover:bg-[#B25337] text-white rounded-lg font-semibold"
                >
                  {isPending ? "Saving..." : "Create Dish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
