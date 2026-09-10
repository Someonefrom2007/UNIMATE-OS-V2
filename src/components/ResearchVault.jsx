import React, { useState } from 'react';
import { BookOpen, Tag, Plus, ExternalLink, Bookmark } from 'lucide-react';

const INITIAL_VAULT = [
  {
    id: 1,
    title: 'Cognitive Load Theory in Interface Architecture',
    tag: 'UI/UX Research',
    author: 'Sweller et al.',
    updated: '2 hours ago',
    excerpt: 'Examining schemas and working memory limitations when designing dense dashboard HUDs.',
  },
  {
    id: 2,
    title: 'Neural Synthetics & Knowledge Graphs',
    tag: 'AI Systems',
    author: 'V. Bush',
    updated: 'Yesterday',
    excerpt: 'Associative indexing mechanisms applied to modern desktop productivity suites.',
  },
  {
    id: 3,
    title: 'Stoic Epistemology & Digital Archival',
    tag: 'Philosophy',
    author: 'A. Aurelius',
    updated: '3 days ago',
    excerpt: 'Structuring personal knowledge stores with minimal temporal decay.',
  }
];

export default function ResearchVault() {
  const [items] = useState(INITIAL_VAULT);

  return (
    <div className="w-full bg-academic-950 p-6 text-academic-parchment rounded-xl border border-academic-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-academic-800">
        <div>
          <h2 className="font-serif text-2xl text-academic-gold tracking-wide flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-academic-gold" /> Research Vault
          </h2>
          <p className="text-xs text-academic-parchment/60 font-mono mt-1">
            Archived Knowledge Bases & Literature Repositories
          </p>
        </div>
        <button className="flex items-center gap-2 bg-academic-burgundy hover:bg-academic-burgundy/80 text-academic-parchment text-xs font-mono px-4 py-2 rounded border border-academic-gold/20 transition-all">
          <Plus className="w-4 h-4" /> New Entry
        </button>
      </div>

      {/* Vault Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div 
            key={item.id}
            className="bg-academic-900 border border-academic-800 rounded-lg p-4 hover:border-academic-gold/50 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xs font-mono px-2 py-0.5 rounded bg-academic-800 text-academic-gold flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {item.tag}
                </span>
                <Bookmark className="w-4 h-4 text-academic-parchment/40 group-hover:text-academic-gold transition-colors" />
              </div>
              <h3 className="font-serif text-sm font-semibold text-academic-parchment group-hover:text-academic-gold transition-colors line-clamp-2">
                {item.title}
              </h3>
              <p className="text-xs text-academic-parchment/60 font-mono mt-1">By {item.author}</p>
              <p className="text-xs text-academic-parchment/80 mt-3 line-clamp-3 italic">
                "{item.excerpt}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-academic-800/60 flex items-center justify-between text-3xs font-mono text-academic-parchment/50">
              <span>Updated {item.updated}</span>
              <ExternalLink className="w-3.5 h-3.5 text-academic-parchment/40 group-hover:text-academic-parchment" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}