import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContentService } from "@/services/ContentService";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export const metadata: Metadata = {
  title: "The Gastronomy Journal",
  description:
    "Stories from the Aegean: ancient olive harvests, wild mountain herbs, wood-fired hearth techniques, and Mediterranean culinary heritage.",
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await ContentService.getBlogPosts(true);

  return (
    <div className="flex flex-col min-h-screen bg-[#0C100D] text-[#F3EEE7]">
      <Header />

      <main className="flex-1 pt-24 pb-28 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-[#FAB44D] font-semibold block mb-2">
              Stories from the Olive Grove
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F3EEE7] mb-4">
              The Gastronomy Journal
            </h1>
            <p className="text-sm sm:text-base text-[#DED7CB]/80 leading-relaxed font-light">
              Essays on olive cultivation, coastal wild foraging, ancient hearth methods, and the seasonal rhythms of the Peloponnese.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {posts.map((post) => (
              <article
                key={post.id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group border border-white/5 hover:border-[#FAB44D]/30 transition-all duration-300"
              >
                <div className="relative h-60 w-full overflow-hidden bg-[#0C100D]">
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141C16] via-transparent to-transparent opacity-80" />
                </div>

                <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-[#FAB44D] mb-2 font-medium">
                      <span>By {post.authorName}</span>
                      <span>•</span>
                      <span>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Journal"}
                      </span>
                    </div>

                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F3EEE7] leading-snug mb-3 group-hover:text-[#FAB44D] transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-[#DED7CB]/80 line-clamp-3 leading-relaxed mb-6 font-light">
                      {post.summary}
                    </p>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#FFB597] group-hover:text-white transition-colors"
                  >
                    <span>Read Article</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
