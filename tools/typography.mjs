// Only format rendered Chinese text nodes; URLs, metadata and source documents stay intact.
export function typesetChineseBody(markup) {
  return markup.replace(/<body\b[\s\S]*?<\/body>/, body =>
    body.split(/(<[^>]*>)/g).map(part => {
      if (part.startsWith('<')) return part;
      return part
        .replace(/(\p{Script=Han})([A-Za-z0-9])/gu, '$1 $2')
        .replace(/([A-Za-z0-9%])(\p{Script=Han})/gu, '$1 $2')
        // These short quantities can move together without locking a whole sentence.
        .replace(/(?<![\w.])\d+(?:[.\u2013-]\d+)?\s*(?:小时|岁|天|位|份|项|个|只|年|月|日)(?:以上|以下|左右)?|(?<![\w.])\d+(?:\.\d+)?%/gu,
          quantity => `<span class="text-unit">${quantity}</span>`);
    }).join('')
  );
}

export function headingBreaks(text, lang) {
  let result = text.replaceAll('<br>', '<br class="title-break"> ');
  if (lang === 'zh-CN') {
    // Protect the short words that break at the tested phone widths, not whole headings.
    result = result.replace(/“听起来不错”|验证的需要|摄像头|承担着|走向|可以|四件|牵挂|照应|理解|连接|不同|节奏|经历/g,
      phrase => `<span class="text-phrase">${phrase}</span>`);
  }
  return result;
}

export function documentLabel(text) {
  const divider = text.search(/[:\uFF1A]/);
  if (divider < 0) return `<span class="document-copy">${text}</span>`;
  return `<span class="document-copy"><span class="document-label">${text.slice(0, divider)}</span><span class="document-detail">${text.slice(divider + 1).trim()}</span></span>`;
}
