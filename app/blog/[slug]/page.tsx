import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentService } from "@/services/ContentService";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await ContentService.getBlogPostBySlug(slug);
  if (!post) return { title: "Article Not Found" };

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await ContentService.getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0C100D] text-[#F3EEE7]">
      <Header />

      <main className="flex-1 pt-24 pb-28 lg:pb-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#DED7CB]/60 mb-8">
            <Link href="/blog" className="hover:text-white transition-colors">
              Journal
            </Link>
            <span>/</span>
            <span className="text-[#FAB44D] truncate max-w-xs">{post.title}</span>
          </div>

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs text-[#FAB44D] mb-3">
              <span>By {post.authorName}</span>
              <span>•</span>
              <span>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Journal"}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#F3EEE7] leading-tight mb-4">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-[#DED7CB]/80 font-light leading-relaxed">
              {post.summary}
            </p>
          </div>

          {/* Hero Cover Image */}
          <div className="relative h-[340px] sm:h-[460px] rounded-3xl overflow-hidden glass-card mb-12 border border-white/10">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>

          {/* Article Body */}
          <div className="prose prose-invert max-w-none text-[#DED7CB] text-base leading-relaxed space-y-6 font-light">
            {post.content.split("\n\n").map((para, i) => (
              <p key={i} className="leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* Back link & Reserve prompt */}
          <div className="pt-12 mt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#DED7CB] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to All Articles</span>
            </Link>

            <Link
              href="/reservation"
              className="h-10 px-5 bg-[#D47D57] hover:bg-[#B25337] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              <span>Reserve a Table at Élaia</span>
            </Link>
          </div>
        </article>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
