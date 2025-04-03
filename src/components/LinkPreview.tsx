// src/components/LinkPreview.tsx
import React from 'react';

interface LinkPreviewProps {
  url: string;
  metadata: any;
  botIcon?: string;
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({ url, metadata, botIcon }) => {
  return (
    <div className="flex items-start mb-2.5 gap-0">
      <img
        src={botIcon || "/placeholder.svg"}
        alt="Bot"
        className="w-9 h-9 min-w-[33px] mt-2"
      />
      <div
        className="mb-2.5 bg-gray-50 p-4 rounded-lg max-w-[77%] mr-auto border border-gray-300 shadow-md cursor-pointer flex items-center"
        onClick={() => window.open(metadata?.url, "_blank")}
      >
        {metadata?.logo && (
          <img
            src={metadata.logo.url || "/placeholder.svg"}
            alt="Logo"
            className="w-10 h-10 rounded-full mr-2.5"
          />
        )}
        <div>
          {metadata?.title && (
            <div className="font-bold text-base text-gray-800 mb-1">
              {metadata.title}
            </div>
          )}
          {metadata?.description && (
            <div className="text-sm text-gray-600 mb-1">
              {metadata.description}
            </div>
          )}
          <a
            href={metadata?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 no-underline text-xs mt-1.5"
          >
            {metadata?.url ? new URL(metadata.url).hostname : ""}
          </a>
        </div>
      </div>
    </div>
  );
};